
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Pedido } from "@/types/order";

export function generatePedidoPDF(pedido: Pedido) {
  const doc = new jsPDF();

  // Encabezado
  doc.setFontSize(20);
  doc.text("Pedido", 15, 20);
  doc.setFontSize(12);
  doc.text(`Nº Orden: ${pedido.numero_orden}`, 15, 30);
  doc.text(`Fecha: ${new Date(pedido.created_at).toLocaleString("es-PE")}`, 15, 38);
  doc.text(`Estado: ${pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}`, 15, 46);

  // Datos de cliente
  doc.setFontSize(14);
  doc.text("Datos del Cliente", 15, 58);
  doc.setFontSize(12);
  doc.text(`Nombre: ${pedido.cliente_nombre || ""}`, 15, 66);
  doc.text(`Teléfono: ${pedido.cliente_telefono || ""}`, 15, 74);
  doc.text(`Email: ${pedido.cliente_email || ""}`, 15, 82);

  // Productos
  doc.setFontSize(14);
  doc.text("Productos", 15, 98);

  // Armar la tabla de productos
  const productosRows = pedido.productos.map((prod) => [
    prod.nombre,
    prod.cantidad.toString(),
    "S/. " + Number(prod.precio).toFixed(2),
    "S/. " + (Number(prod.precio) * Number(prod.cantidad)).toFixed(2),
  ]);
  autoTable(doc, {
    startY: 104,
    head: [["Producto", "Cantidad", "Precio Unit.", "Subtotal"]],
    body: productosRows,
    theme: "grid",
  });

  // Observaciones
  const lastTableY = (doc as any).lastAutoTable?.finalY || 104 + productosRows.length * 10 + 20;
  if (pedido.observaciones) {
    doc.setFontSize(12);
    doc.text("Observaciones:", 15, lastTableY + 14);
    doc.setFontSize(11);
    doc.text(pedido.observaciones, 15, lastTableY + 20);
  }

  // Total
  doc.setFontSize(13);
  doc.text(
    `Total: S/. ${Number(pedido.total).toLocaleString("es-PE", { minimumFractionDigits: 2 })}`,
    15,
    lastTableY + (pedido.observaciones ? 34 : 18)
  );

  // Descarga
  doc.save(`Pedido-${pedido.numero_orden || pedido.id}.pdf`);
}
