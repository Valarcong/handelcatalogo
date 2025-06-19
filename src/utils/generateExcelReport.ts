
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
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Ventas");
  XLSX.writeFile(wb, "reporte_ventas.xlsx");
}

// Excel productos
export async function generateProductsExcel(products: Product[]) {
  const rows = products.map(p => ({
    Código: p.code,
    Nombre: p.name,
    Categoría: p.category,
    Marca: p.brand,
    "Precio Unitario": Number(p.unitPrice),
    "Precio Mayorista": Number(p.wholesalePrice),
    "Cantidad Mínima Mayorista": p.minimumWholesaleQuantity,
    Etiquetas: (p.tags ?? []).join(", "),
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Productos");
  XLSX.writeFile(wb, "reporte_productos.xlsx");
}
