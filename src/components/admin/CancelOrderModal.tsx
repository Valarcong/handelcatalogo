import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface CancelOrderModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (motivo: string) => Promise<void>;
}

const motivosPredefinidos = [
  "Cliente no respondió",
  "Cliente se arrepintió",
  "Error en información",
  "No hay stock disponible",
  "Otro",
];

const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const [motivo, setMotivo] = useState("");
  const [motivoExtra, setMotivoExtra] = useState("");
  const [saving, setSaving] = useState(false);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const motivoFinal = motivo === "Otro" ? motivoExtra : motivo;
      await onConfirm(motivoFinal || "");
      onClose();
    } finally {
      setSaving(false);
      setMotivo("");
      setMotivoExtra("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={open => !open ? onClose() : undefined}>
      <DialogContent>
        <form onSubmit={handleConfirm} className="space-y-4">
          <div>
            <div className="font-bold text-lg mb-2">
              Cancelar pedido
              <Badge variant="destructive" className="ml-2">Esta acción es irreversible</Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              ¿Estás seguro que deseas cancelar este pedido? Puedes escribir un motivo si lo deseas.
            </div>
          </div>
          <div>
            <label className="block text-gray-600 mb-1 text-sm">Motivo de cancelación</label>
            <select
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring"
              value={motivo}
              onChange={e => setMotivo(e.target.value)}
              required
            >
              <option value="">Selecciona motivo...</option>
              {motivosPredefinidos.map(op => (
                <option value={op} key={op}>{op}</option>
              ))}
            </select>
            {motivo === "Otro" && (
              <Textarea
                className="mt-2"
                placeholder="Especifica el motivo"
                value={motivoExtra}
                onChange={e => setMotivoExtra(e.target.value)}
                required
              />
            )}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>Cancelar</Button>
            <Button type="submit" variant="destructive" disabled={saving || (!motivo && !motivoExtra)}>
              {saving ? "Cancelando..." : "Confirmar cancelación"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CancelOrderModal;
