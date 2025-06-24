import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Pedido } from "@/types/order";

export function generatePedidoPDF(pedido: Pedido, tc: number) {
  const doc = new jsPDF();

  // Encabezado
  doc.setFontSize(20);
  doc.text("Pedido", 15, 20);
  doc.setFontSize(12);
  doc.text(`Nº Orden: ${pedido.numero_orden}`, 15, 30);
  doc.text(`Fecha: ${new Date(pedido.created_at).toLocaleString("es-PE")}`, 15, 38);
  doc.text(`Estado: ${pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}`, 15, 46);
  doc.text(`T.C. usado: ${tc.toFixed(3)}`, 15, 54);

  // Datos de cliente
  doc.setFontSize(14);
  doc.text("Datos del Cliente", 15, 66);
  doc.setFontSize(12);
  doc.text(`Nombre: ${pedido.cliente_nombre || ""}`, 15, 74);
  doc.text(`Teléfono: ${pedido.cliente_telefono || ""}`, 15, 82);
  doc.text(`Email: ${pedido.cliente_email || ""}`, 15, 90);

  // Productos
  doc.setFontSize(14);
  doc.text("Productos", 15, 106);

  // Armar la tabla de productos (convertir a soles)
  const productosRows = pedido.productos.map((prod) => [
    prod.nombre,
    (prod.cantidad ?? 0).toString(),
    "S/. " + (Number(prod.precio_venta ?? 0) * tc).toLocaleString("es-PE", { minimumFractionDigits: 2 }),
    "S/. " + (Number(prod.precio_venta ?? 0) * Number(prod.cantidad ?? 0) * tc).toLocaleString("es-PE", { minimumFractionDigits: 2 }),
  ]);
  autoTable(doc, {
    startY: 112,
    head: [["Producto", "Cantidad", "Precio Unit. (S/.)", "Subtotal (S/.)"]],
    body: productosRows,
    theme: "grid",
  });

  // Observaciones
  const lastTableY = (doc as any).lastAutoTable?.finalY || 112 + productosRows.length * 10 + 20;
  if (pedido.observaciones) {
    doc.setFontSize(12);
    doc.text("Observaciones:", 15, lastTableY + 14);
    doc.setFontSize(11);
    doc.text(pedido.observaciones, 15, lastTableY + 20);
  }

  // Total (convertido a soles)
  doc.setFontSize(13);
  doc.text(
    `Total: S/. ${(Number(pedido.total) * tc).toLocaleString("es-PE", { minimumFractionDigits: 2 })}`,
    15,
    lastTableY + (pedido.observaciones ? 34 : 18)
  );

  // Descarga
  doc.save(`Pedido-${pedido.numero_orden || pedido.id}.pdf`);
}
