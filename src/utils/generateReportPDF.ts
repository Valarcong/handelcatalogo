import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Pedido } from "@/types/order";
import { Product } from "@/types/product";

// PDF de ventas
export async function generateSalesReportPDF(pedidos: Pedido[], range?: { from: string; to: string }) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Reporte de Ventas", 15, 18);
  doc.setFontSize(12);
  doc.text(`Cantidad de pedidos: ${pedidos.length}`, 15, 28);
  if (range && range.from && range.to) {
    doc.text(`Rango: ${range.from} a ${range.to}`, 15, 36);
  }
  const startY = range && range.from && range.to ? 48 : 40;

  const rows = pedidos.map(p => [
    p.numero_orden,
    p.cliente_nombre,
    p.estado,
    p.created_at ? new Date(p.created_at).toLocaleDateString("es-PE") : "",
    "S/. " + Number(p.total).toFixed(2),
    (Array.isArray(p.productos) && p.productos.length > 0)
      ? p.productos.map(prod => `${prod.nombre} x${prod.cantidad}`).join(", ")
      : "-"
  ]);
  autoTable(doc, {
    head: [["N° Orden", "Cliente", "Estado", "Fecha", "Total", "Productos Vendidos"]],
    body: rows,
    startY,
  });

  doc.save("reporte_ventas.pdf");
}

// PDF de productos (catálogo resumido)
export async function generateProductsReportPDF(products: Product[], pedidos: Pedido[], range?: { from: string; to: string }) {
  // Calcular cantidad vendida por producto
  const cantidadVendida: Record<string, number> = {};
  pedidos.forEach(p => {
    (p.productos || []).forEach(prod => {
      cantidadVendida[prod.nombre] = (cantidadVendida[prod.nombre] || 0) + Number(prod.cantidad);
    });
  });
  // Solo productos vendidos en el rango
  const vendidos = products.filter(p => cantidadVendida[p.name]);

  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Catálogo de Productos Vendidos", 15, 18);
  doc.setFontSize(12);
  doc.text(`Total productos vendidos: ${vendidos.length}`, 15, 28);
  if (range && range.from && range.to) {
    doc.text(`Rango: ${range.from} a ${range.to}`, 15, 36);
  }
  const startY = range && range.from && range.to ? 48 : 40;

  const rows = vendidos.map(p => [
    p.code,
    p.name,
    p.category,
    p.brand,
    "S/. " + Number(p.unitPrice).toFixed(2),
    cantidadVendida[p.name] || 0,
    p.tags?.join(", "),
  ]);
  autoTable(doc, {
    head: [["Código", "Nombre", "Categoría", "Marca", "Precio Unitario", "Cantidad Vendida", "Etiquetas"]],
    body: rows,
    startY,
  });

  doc.save("catalogo_productos_vendidos.pdf");
}

// PDF de clientes
export async function generateClientesReportPDF(clientes: Array<{ nombre: string; email?: string; telefono?: string; fecha_registro?: string; cantidad_ordenes?: number }>) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Reporte de Clientes", 15, 18);
  doc.setFontSize(12);
  doc.text(`Total clientes: ${clientes.length}`, 15, 28);

  const rows = clientes.map(c => [
    c.nombre,
    c.email || "-",
    c.telefono || "-",
    c.fecha_registro ? new Date(c.fecha_registro).toLocaleDateString("es-PE") : "-",
    typeof c.cantidad_ordenes === 'number' ? c.cantidad_ordenes : 0
  ]);
  autoTable(doc, {
    head: [["Nombre", "Email", "Teléfono", "Fecha de Registro", "Órdenes"]],
    body: rows,
    startY: 40,
  });

  doc.save("reporte_clientes.pdf");
}
