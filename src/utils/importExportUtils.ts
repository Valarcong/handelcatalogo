
// Utilidades, tipos y constantes para import/export de productos

import * as XLSX from 'xlsx';
import { Product } from '@/types/product';

export type ImportPreviewRow = {
  rowNumber: number;
  data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
  error: string | null;
};

// Ahora la columna imagen es opcional
export const REQUIRED_COLUMNS = [
  'Nombre',
  'Código',
  'Marca',
  'Imagen URL', // Nueva columna opcional
  'Descripción',
  'Categoría',
  'Precio Unitario',
  'Precio Mayor',
  'Cantidad Mínima Mayorista',
  'Etiquetas'
];

// Descarga un archivo de plantilla ejemplo
export function downloadTemplate() {
  const ws = XLSX.utils.aoa_to_sheet([
    REQUIRED_COLUMNS,
    [
      'Ej: Taper Rectangular',
      'OMEGA1001',
      'omegaplast',
      // Ejemplo de imagen vía URL y alternativa vacía
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
      'Taper plástico rectangular con tapa',
      'Tapers',
      '5.5',
      '4.2',
      '10',
      'tapercito,almacenaje,rectangular'
    ]
  ]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Plantilla');
  const wbout = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.download = 'plantilla_productos_omegaplast.xlsx';
  a.href = url;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
