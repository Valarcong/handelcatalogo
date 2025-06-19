
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Pedido } from "@/types/order";
import { Product } from "@/types/product";

// PDF de ventas
export async function generateSalesReportPDF(pedidos: Pedido[]) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Reporte de Ventas", 15, 18);
  doc.setFontSize(12);
  doc.text(`Cantidad de pedidos: ${pedidos.length}`, 15, 28);

  const rows = pedidos.map(p => [
    p.numero_orden,
    p.cliente_nombre,
    p.estado,
    p.created_at ? new Date(p.created_at).toLocaleDateString("es-PE") : "",
    "S/. " + Number(p.total).toFixed(2),
  ]);
  autoTable(doc, {
    head: [["N° Orden", "Cliente", "Estado", "Fecha", "Total"]],
    body: rows,
    startY: 40,
  });

  doc.save("reporte_ventas.pdf");
}

// PDF de productos (catálogo resumido)
export async function generateProductsReportPDF(products: Product[]) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Catálogo de Productos", 15, 18);
  doc.setFontSize(12);
  doc.text(`Total productos: ${products.length}`, 15, 28);

  const rows = products.map(p => [
    p.code,
    p.name,
    p.category,
    p.brand,
    "S/. " + Number(p.unitPrice).toFixed(2),
    p.tags?.join(", "),
  ]);
  autoTable(doc, {
    head: [["Código", "Nombre", "Categoría", "Marca", "Precio Unitario", "Etiquetas"]],
    body: rows,
    startY: 40,
  });

  doc.save("catalogo_productos.pdf");
}
