
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PedidoCliente } from "@/hooks/usePedido";

interface PedidoModalProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  onConfirm: (cliente: PedidoCliente) => void;
  loading: boolean;
  /** Lista de productos a mostrar en el resumen **/
  resumen?: React.ReactNode;
}

const isContactoValido = (cliente: PedidoCliente) =>
  Boolean(cliente.cliente_email?.trim() || cliente.cliente_telefono?.trim());

const PedidoModal: React.FC<PedidoModalProps> = ({ open, setOpen, onConfirm, loading, resumen }) => {
  const [cliente, setCliente] = useState<PedidoCliente>({
    cliente_nombre: "",
    cliente_email: "",
    cliente_telefono: "",
    observaciones: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliente.cliente_nombre || !isContactoValido(cliente)) return;
    onConfirm(cliente);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Completa tus datos para el pedido</DialogTitle>
        </DialogHeader>
        {/* Mostrar resumen si está disponible */}
        {resumen && 
          <div className="border p-2 rounded bg-gray-50 text-xs mb-2 max-h-40 overflow-y-auto">
            <h4 className="font-semibold mb-1 text-brand-navy">Resumen del pedido</h4>
            {resumen}
          </div>
        }
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            name="cliente_nombre"
            placeholder="Tu nombre"
            value={cliente.cliente_nombre}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <Input
            name="cliente_telefono"
            placeholder="WhatsApp (obligatorio si no envías email)"
            value={cliente.cliente_telefono}
            onChange={handleChange}
            required={!cliente.cliente_email}
            disabled={loading}
            type="tel"
          />
          <Input
            name="cliente_email"
            type="email"
            placeholder="Email (obligatorio si no envías WhatsApp)"
            value={cliente.cliente_email}
            onChange={handleChange}
            required={!cliente.cliente_telefono}
            disabled={loading}
          />
          <Textarea
            name="observaciones"
            placeholder="Observaciones (ej. entrega, dudas, etc)"
            value={cliente.observaciones}
            onChange={handleChange}
            disabled={loading}
          />
          <DialogFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={
                !cliente.cliente_nombre ||
                !isContactoValido(cliente) ||
                loading
              }
            >
              Enviar pedido
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PedidoModal;

