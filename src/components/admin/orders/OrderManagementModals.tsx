import React, { useState } from "react";
import { Pedido, PedidoEstado } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2, AlertTriangle } from "lucide-react";
import EditOrderModal from "../EditOrderModal";
import CancelOrderModal from "../CancelOrderModal";
import NewOrderModal from "../NewOrderModal";

interface OrderManagementModalsProps {
  newOrderModal: boolean;
  setNewOrderModal: (open: boolean) => void;
  modal: { open: boolean; pedido: Pedido | null };
  setModal: (modal: { open: boolean; pedido: Pedido | null }) => void;
  cancelModal: { open: boolean; pedido: Pedido | null };
  setCancelModal: (modal: { open: boolean; pedido: Pedido | null }) => void;
  deleteModal: { open: boolean; pedido: Pedido | null };
  setDeleteModal: (modal: { open: boolean; pedido: Pedido | null }) => void;
  onSave: (pedidoData: Partial<Pedido>) => Promise<void>;
  onCancelPedido: (pedido: Pedido, motivo: string) => Promise<void>;
  onCreatePedido: (pedidoData: Partial<Pedido>) => Promise<void>;
  onDeletePedido: (pedido: Pedido) => Promise<void>;
  loading: boolean;
}

const OrderManagementModals: React.FC<OrderManagementModalsProps> = ({
  newOrderModal,
  setNewOrderModal,
  modal,
  setModal,
  cancelModal,
  setCancelModal,
  deleteModal,
  setDeleteModal,
  onSave,
  onCancelPedido,
  onCreatePedido,
  onDeletePedido,
  loading,
}) => {
  return (
    <>
      {/* Modal para crear pedido */}
      {newOrderModal && (
        <NewOrderModal
          open={newOrderModal}
          onClose={() => setNewOrderModal(false)}
          onSave={onCreatePedido}
        />
      )}
      
      {/* Modal para cancelar pedido */}
      <CancelOrderModal
        open={cancelModal.open}
        onClose={() => setCancelModal({ open: false, pedido: null })}
        onConfirm={motivo =>
          cancelModal.pedido ? onCancelPedido(cancelModal.pedido, motivo) : Promise.resolve()
        }
      />
      
      {/* Modal para eliminar pedido */}
      <DeleteOrderModal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, pedido: null })}
        onConfirm={() => deleteModal.pedido ? onDeletePedido(deleteModal.pedido) : Promise.resolve()}
        loading={loading}
        pedido={deleteModal.pedido}
      />
      
      {/* Modal para editar pedido */}
      <EditOrderModal
        pedido={modal.pedido}
        open={modal.open}
        onClose={() => setModal({ open: false, pedido: null })}
        onSave={onSave}
      />
    </>
  );
};

interface DeleteOrderModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading: boolean;
  pedido: Pedido | null;
}

export const DeleteOrderModal: React.FC<DeleteOrderModalProps> = ({
  open,
  onClose,
  onConfirm,
  loading,
  pedido,
}) => {
  if (!open || !pedido) return null;

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Eliminar Pedido Permanentemente
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            <div className="space-y-3">
              <p className="font-medium text-gray-900">
                ¿Estás seguro de que quieres eliminar este pedido?
              </p>
              <div className="bg-red-50 p-3 rounded-md border border-red-200">
                <p className="text-sm text-red-700">
                  <strong>Pedido #{pedido.numero_orden}</strong>
                </p>
                <p className="text-sm text-red-600 mt-1">
                  Cliente: {pedido.cliente_nombre}
                </p>
                <p className="text-sm text-red-600">
                  Total: S/. {pedido.total.toFixed(2)}
                </p>
                <p className="text-sm text-red-600">
                  Estado: {pedido.estado}
                </p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
                <p className="text-sm text-yellow-800 font-medium">
                  ⚠️ Esta acción es irreversible
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  El pedido será eliminado completamente de la base de datos y no podrá ser recuperado.
                </p>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? "Eliminando..." : "Sí, eliminar permanentemente"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OrderManagementModals; 