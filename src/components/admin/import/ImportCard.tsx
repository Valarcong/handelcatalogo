
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImportPreviewTable } from "./ImportPreviewTable";
import { downloadTemplate, ImportPreviewRow } from "@/utils/importExportUtils";

interface ImportCardProps {
  importRows: ImportPreviewRow[] | null;
  isImporting: boolean;
  importResult: { success: number; error: number };
  handleFileImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleImportConfirm: () => void;
  setImportRows: (rows: ImportPreviewRow[] | null) => void;
}

const ImportCard: React.FC<ImportCardProps> = ({
  importRows,
  isImporting,
  importResult,
  handleFileImport,
  handleImportConfirm,
  setImportRows,
}) => (
  <div className="bg-white rounded shadow p-4">
    <p className="text-sm text-gray-600 mb-4">
      Importa productos desde un archivo Excel o CSV. El archivo debe contener las columnas:&nbsp;
      <b>Nombre, Código, Marca, Imagen URL (opcional), Descripción, Categoría, Precio Unitario, Precio Mayor, Cantidad Mínima Mayorista, Etiquetas.</b>
      <br />
      <span className="text-blue-700 text-xs">
        Puedes dejar vacía la columna <b>Imagen URL</b>. Si quieres que algún producto tenga su imagen, pega el link a la imagen directa (por ejemplo, de tu drive, dropbox, o un lugar público).
      </span>
    </p>
    <Button size="sm" variant="secondary" onClick={downloadTemplate} className="mb-4">
      Descargar plantilla ejemplo
    </Button>
    <Input
      type="file"
      accept=".xlsx,.xls,.csv"
      onChange={handleFileImport}
      className="mb-4"
      disabled={isImporting}
    />
    <p className="text-xs text-gray-500 mb-2">
      Formatos soportados: Excel (.xlsx, .xls), CSV (.csv)
    </p>
    {importRows && (
      <>
        <div className="font-medium mb-2 text-sm">Previsualización de importación:</div>
        <ImportPreviewTable importRows={importRows} />
        <div className="flex gap-2 mt-2">
          <Button
            onClick={handleImportConfirm}
            disabled={isImporting || importRows.every((r) => r.error)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isImporting ? "Importando..." : "Confirmar importación"}
          </Button>
          <Button onClick={() => setImportRows(null)} variant="outline" disabled={isImporting}>
            Cancelar
          </Button>
        </div>
        <div className="text-xs mt-2 text-gray-700">
          {importRows.filter((r) => !r.error).length} productos válidos de {importRows.length}.
        </div>
        {importResult.success > 0 || importResult.error > 0 ? (
          <div className="text-xs mt-2 text-blue-800">
            Importados: <b>{importResult.success}</b>. Errores: <b>{importResult.error}</b>.
          </div>
        ) : null}
      </>
    )}
  </div>
);

export default ImportCard;
