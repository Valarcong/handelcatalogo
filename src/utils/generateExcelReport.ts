import * as XLSX from "xlsx";
import { Pedido } from "@/types/order";
import { Product } from "@/types/product";

// Excel ventas
export async function generateSalesExcel(pedidos: Pedido[]) {
  const rows = pedidos.map(p => ({
    "N° Orden": p.numero_orden,
    Cliente: p.cliente_nombre,
    Estado: p.estado,
    Fecha: p.created_at ? new Date(p.created_at).toLocaleString("es-PE") : "",
    Total: Number(p.total),
    "Productos Vendidos": (Array.isArray(p.productos) && p.productos.length > 0)
      ? p.productos.map(prod => `${prod.nombre} x${prod.cantidad}`).join(", ")
      : "-"
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Ventas");
  XLSX.writeFile(wb, "reporte_ventas.xlsx");
}

// Excel productos
export async function generateProductsExcel(products: Product[], pedidos: Pedido[]) {
  // Calcular cantidad vendida por producto
  const cantidadVendida: Record<string, number> = {};
  pedidos.forEach(p => {
    (p.productos || []).forEach(prod => {
      cantidadVendida[prod.nombre] = (cantidadVendida[prod.nombre] || 0) + Number(prod.cantidad);
    });
  });
  // Solo productos vendidos en el rango
  const vendidos = products.filter(p => cantidadVendida[p.name]);

  const rows = vendidos.map(p => ({
    Código: p.code,
    Nombre: p.name,
    Categoría: p.category,
    Marca: p.brand,
    "Precio Unitario": Number(p.unitPrice),
    "Cantidad Vendida": cantidadVendida[p.name] || 0,
    Etiquetas: (p.tags ?? []).join(", "),
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Productos Vendidos");
  XLSX.writeFile(wb, "reporte_productos_vendidos.xlsx");
}
