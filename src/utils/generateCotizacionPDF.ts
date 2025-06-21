import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Cotizacion } from '@/hooks/useCotizaciones';
import logo from '@/../public/imagenes/logo/Handel_Logo_Color.png';

export async function generateCotizacionPDF(cotizacion: Cotizacion, productos: any[], cliente: any) {
  const doc = new jsPDF();

  // Logo
  const img = new Image();
  img.src = logo;
  await new Promise(resolve => { img.onload = resolve; });
  doc.addImage(img, 'PNG', 80, 8, 50, 18); // centrado arriba

  // Número de cotización correlativo
  const numeroCotizacion = cotizacion.correlativo
    ? `COT-${cotizacion.correlativo.toString().padStart(5, '0')}`
    : cotizacion.id.slice(-5);

  doc.setFontSize(14);
  doc.text(`Cotización - ${numeroCotizacion}`, 105, 32, { align: 'center' });

  // Datos principales
  doc.setFontSize(10);
  let y = 40;
  // Lado izquierdo
  let nombreCliente = cotizacion.razon_social || cotizacion.nombre_cliente || '';
  doc.text(`Cliente: ${nombreCliente}`, 14, y);
  if (cotizacion.ruc) {
    y += 6;
    doc.text(`RUC: ${cotizacion.ruc}`, 14, y);
  }
  // Lado derecho
  y = 40;
  doc.text(`Fecha: ${new Date(cotizacion.creado_en).toLocaleDateString()}`, 150, y);
  y += 6;
  doc.text(`Teléfono: ${cliente?.telefono || cliente?.celular || '-'}`, 150, y);

  // Atención y vendedor
  y += 10;
  doc.setFontSize(10);
  doc.text(`Atención: SR. ${nombreCliente}`, 14, y);
  y += 6;
  doc.text('Vendedor: Vincent Alarcón', 14, y);

  // Saludo
  y += 10;
  doc.setFontSize(10);
  doc.text('Estimados Señores:', 14, y);
  y += 6;
  doc.text('En atención a su amable solicitud nos es grato ofrecerle lo siguiente:', 14, y);

  // Tabla de productos
  y += 4;
  autoTable(doc, {
    startY: y,
    head: [[
      '#', 'Código producto', 'Nombre Producto', 'Cantidad', 'Precio Unitario', 'Total SIN IGV'
    ]],
    body: productos.map((prod, idx) => [
      idx + 1,
      prod.sku || '',
      prod.nombre_producto,
      prod.cantidad,
      prod.precio_unitario.toFixed(2),
      (prod.precio_unitario * prod.cantidad).toFixed(2)
    ]),
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185] },
    styles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 30 },
      2: { cellWidth: 60 },
      3: { cellWidth: 18 },
      4: { cellWidth: 25 },
      5: { cellWidth: 30 },
    },
  });
  y = (doc as any).lastAutoTable.finalY + 6;

  // Condiciones y totales
  const subtotal = productos.reduce((sum, p) => sum + p.precio_unitario * p.cantidad, 0);
  const igv = subtotal * 0.18;
  const total = subtotal + igv;

  // Lado izquierdo condiciones
  doc.setFontSize(10);
  doc.text('Tiempo de Entrega: DE STOCK', 14, y);
  y += 6;
  doc.text('Condición de Pago: Contado', 14, y);
  y += 6;
  doc.text('Validez de Oferta: 15 días', 14, y);
  y += 6;
  doc.text('Garantía: 1 AÑO', 14, y);
  y += 6;
  doc.text(`Observaciones: ${cotizacion.observaciones && cotizacion.observaciones.trim() !== '' ? cotizacion.observaciones : '-'}`, 14, y);

  // Lado derecho totales
  let yTot = (doc as any).lastAutoTable.finalY + 6;
  doc.text(`Subtotal: S/ ${subtotal.toFixed(2)}`, 150, yTot);
  yTot += 6;
  doc.text(`IGV: S/ ${igv.toFixed(2)}`, 150, yTot);
  yTot += 6;
  doc.text(`Total: S/ ${total.toFixed(2)}`, 150, yTot);

  // Notas finales
  y = Math.max(y, yTot) + 12;
  doc.setFontSize(9);
  doc.text('El tiempo de entrega rige a partir de recibida la orden de compra.', 14, y);
  y += 5;
  doc.text('Esperamos que nuestra propuesta sea de su interés, para cualquier consulta quedamos a su disposición.', 14, y);

  // Atentamente y datos del vendedor
  y += 12;
  doc.setFontSize(10);
  doc.text('Atentamente', 14, y);
  y += 6;
  doc.text('Vincent Alarcón', 14, y);
  y += 6;
  doc.text('Asesor Técnico Comercial', 14, y);
  y += 6;
  doc.text('Cel: +51 997 369 476', 14, y);
  y += 6;
  doc.text('E: victor.costilla@handelsac.com', 14, y);

  doc.save(`cotizacion_${numeroCotizacion}.pdf`);
} 