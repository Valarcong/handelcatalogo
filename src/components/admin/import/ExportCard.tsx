import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Product } from "@/types/product";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";

interface ExportCardProps {
  products: Product[];
}

const ExportCard: React.FC<ExportCardProps> = ({ products }) => {
  const { toast } = useToast();

  const handleExportData = () => {
    const dataStr = JSON.stringify(products, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "productos_omegaplast.json";
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Datos exportados (JSON)",
      description: "Los productos han sido exportados a JSON exitosamente.",
    });
  };

  const handleExportExcel = () => {
    // Exportar productos a Excel con formato igual a la plantilla de importación (excepto Imagen URL)
    const rows = products.map((p) => ({
      'Nombre': p.name,
      'Código': p.code,
      'Marca': p.brand,
      // 'Imagen URL' omitido
      'Descripción': p.description || '',
      'Categoría': p.category,
      'Precio Unitario': Number(p.unitPrice),
      'Precio Mayor': Number(p.wholesalePrice),
      'Cantidad Mínima Mayorista': p.minimumWholesaleQuantity ?? '',
      'Etiquetas': Array.isArray(p.tags) ? p.tags.join(';') : '',
      'Características': Array.isArray(p.features) ? p.features.join(';') : '',
      'Especificaciones Técnicas': p.technicalSpecs ? Object.entries(p.technicalSpecs).map(([k, v]) => `${k}:${v}`).join(';') : ''
    }));
    const ws = XLSX.utils.json_to_sheet(rows, { header: [
      'Nombre',
      'Código',
      'Marca',
      // 'Imagen URL', // omitido
      'Descripción',
      'Categoría',
      'Precio Unitario',
      'Precio Mayor',
      'Cantidad Mínima Mayorista',
      'Etiquetas',
      'Características',
      'Especificaciones Técnicas'
    ] });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Productos');
    XLSX.writeFile(wb, 'productos_handel.xlsx');
    toast({
      title: 'Excel exportado',
      description: 'Productos exportados a archivo Excel.',
    });
  };

  return (
    <div className="bg-white rounded shadow p-4 flex flex-col gap-6">
      <p className="text-sm text-gray-600 mb-4">
        Descarga los productos en formato JSON o Excel.
      </p>
      <Button onClick={handleExportData}>
        <Download className="h-4 w-4 mr-2" />
        Exportar JSON
      </Button>
      <Button variant="outline" onClick={handleExportExcel} className="mt-2">
        <Download className="h-4 w-4 mr-2" />
        Exportar Excel
      </Button>
    </div>
  );
};

export default ExportCard;
