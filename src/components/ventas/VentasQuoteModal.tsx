
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { useInsertCotizacionVenta } from "@/hooks/useCotizacionesVentas";
import { useAuthContext } from "@/hooks/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface VentasQuoteModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  quantity: number;
  phone?: string;
}

const getDefaultMessage = (product: Product, quantity: number, margin: number) => {
  const unitPrice = quantity >= 10 ? product.wholesalePrice : product.unitPrice;
  const total = unitPrice * quantity;
  const priceType = quantity >= 10 ? "Por Mayor" : "Unitario";
  return (
`¡Hola! Quisiera cotizar el siguiente producto:

🧾 *${product.name}*
📋 Código: ${product.code}
📦 Cantidad: ${quantity}
💰 Precio ${priceType}: S/. ${unitPrice.toFixed(2)}
💵 Subtotal: S/. ${total.toFixed(2)}
📈 Margen Bruto aprox: ${margin} %

¿Podrían enviarme confirmación de disponibilidad y tiempos de entrega?

Gracias.`
  );
};

const VentasQuoteModal: React.FC<VentasQuoteModalProps> = ({ open, onClose, product, quantity, phone = "51970337910" }) => {
  const [qty, setQty] = useState(quantity);
  const [message, setMessage] = useState("");
  const [margin, setMargin] = useState(20); // Por defecto 20%
  const { toast } = useToast();
  const { user } = useAuthContext();
  const insertCotizacion = useInsertCotizacionVenta();

  React.useEffect(() => {
    if (product) {
      setMessage(getDefaultMessage(product, qty, margin));
    }
    // eslint-disable-next-line
  }, [product, qty, margin]);

  if (!product) {
    return null;
  }

  const handleSend = async () => {
    const unitPrice = qty >= 10 ? product.wholesalePrice : product.unitPrice;
    const total = unitPrice * qty;

    // Guardar la cotización en Supabase
    try {
      await insertCotizacion.mutateAsync({
        nombre_cliente: "",
        telefono_cliente: "",
        email_cliente: "",
        producto_id: product.id,
        producto_nombre: product.name,
        producto_codigo: product.code,
        cantidad: qty,
        precio_unitario: unitPrice,
        precio_total: total,
        precio_tipo: qty >= 10 ? "mayorista" : "unitario",
        margen_est_mensaje: margin,
        mensaje: message,
        estado: "pendiente",
        enviado_por: user?.id ?? null,
      });
      toast({ title: "Cotización guardada", description: "La cotización fue guardada y enviada por WhatsApp.", duration: 4000 });
    } catch (error: any) {
      toast({ title: "Error al guardar", description: error.message || "Hubo un error al guardar la cotización.", variant: "destructive" });
    }

    // Enviar WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={val => !val && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cotizar vía WhatsApp</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm">Cantidad</label>
            <Input
              type="number"
              min={1}
              value={qty}
              onChange={e => setQty(Math.max(1, Number(e.target.value)))}
              className="w-24"
            />
          </div>
          <div>
            <label className="text-sm">Margen estimado (%)</label>
            <Input
              type="number"
              min={0}
              max={100}
              value={margin}
              onChange={e => setMargin(Math.max(0, Math.min(100, Number(e.target.value))))}
              className="w-24"
            />
            <p className="text-xs text-muted-foreground">Añade el margen que deseas para calcular el precio final mostrado en la cotización.</p>
          </div>
          <div>
            <label className="text-sm">Mensaje a enviar</label>
            <Textarea
              rows={8}
              value={message}
              onChange={e => setMessage(e.target.value)}
              spellCheck={false}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancelar
            </Button>
          </DialogClose>
          <Button onClick={handleSend} className="bg-green-600 text-white hover:bg-green-700" disabled={insertCotizacion.isPending}>
            Enviar a WhatsApp
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VentasQuoteModal;
