import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileDown } from "lucide-react";
import { Product } from "@/types/product";
import { Pedido } from "@/types/order";
import { generateSalesReportPDF, generateProductsReportPDF } from "@/utils/generateReportPDF";
import { generateSalesExcel, generateProductsExcel } from "@/utils/generateExcelReport";
import { useToast } from "@/hooks/use-toast";

interface AdminReportsSectionProps {
  pedidos: Pedido[];
  productos: Product[];
  range?: { from: string; to: string };
}

const AdminReportsSection: React.FC<AdminReportsSectionProps> = ({ pedidos, productos, range }) => {
  const { toast } = useToast();
  const [downloading, setDownloading] = useState(false);

  const handleExportSalesPDF = async () => {
    setDownloading(true);
    await generateSalesReportPDF(pedidos, range);
    setDownloading(false);
    toast({ title: "Reporte PDF generado", description: "Se descargó el PDF de ventas." });
  };

  const handleExportSalesExcel = async () => {
    setDownloading(true);
    await generateSalesExcel(pedidos);
    setDownloading(false);
    toast({ title: "Excel generado", description: "Reporte Excel de ventas descargado." });
  };

  const handleExportProductsPDF = async () => {
    setDownloading(true);
    await generateProductsReportPDF(productos, pedidos, range);
    setDownloading(false);
    toast({ title: "PDF generado", description: "Catálogo PDF descargado." });
  };

  const handleExportProductsExcel = async () => {
    setDownloading(true);
    await generateProductsExcel(productos, pedidos);
    setDownloading(false);
    toast({ title: "Excel generado", description: "Reporte Excel de productos descargado." });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-xl mb-2 flex items-center gap-2">
        <FileDown className="h-5 w-5" />
        Exportar Reportes
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Reporte de Ventas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-2">
              <Button onClick={handleExportSalesPDF} disabled={downloading}>
                <Download className="w-4 h-4 mr-2" /> PDF
              </Button>
              <Button onClick={handleExportSalesExcel} disabled={downloading} variant="outline">
                <Download className="w-4 h-4 mr-2" /> Excel
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              Incluye detalle de pedidos, total de ventas y productos vendidos.
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Catálogo/Reporte de Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-2">
              <Button onClick={handleExportProductsPDF} disabled={downloading}>
                <Download className="w-4 h-4 mr-2" /> PDF
              </Button>
              <Button onClick={handleExportProductsExcel} disabled={downloading} variant="outline">
                <Download className="w-4 h-4 mr-2" /> Excel
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              Genera un catálogo en PDF o Excel para tus productos.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
export default AdminReportsSection;
