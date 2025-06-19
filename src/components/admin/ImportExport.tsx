
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Upload, Download } from "lucide-react";
import { Product } from "@/types/product";
import { useProducts } from "@/hooks/useProducts";
import { useFileImport } from "@/hooks/useFileImport";
import ImportCard from "./import/ImportCard";
import ExportCard from "./import/ExportCard";

interface ImportExportProps {
  products: Product[];
}

const ImportExport: React.FC<ImportExportProps> = ({ products }) => {
  const {
    importRows,
    setImportRows,
    isImporting,
    importResult,
    handleFileImport,
    handleImportConfirm,
  } = useFileImport(products);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Importar Productos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ImportCard
            importRows={importRows}
            setImportRows={setImportRows}
            isImporting={isImporting}
            importResult={importResult}
            handleFileImport={handleFileImport}
            handleImportConfirm={handleImportConfirm}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Exportar Productos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ExportCard products={products} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportExport;
