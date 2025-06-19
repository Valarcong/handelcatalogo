
import React from "react";
import { ImportPreviewRow } from "@/utils/importExportUtils";

interface ImportPreviewTableProps {
  importRows: ImportPreviewRow[];
}

export const ImportPreviewTable: React.FC<ImportPreviewTableProps> = ({ importRows }) => (
  <div className="my-4 max-w-full overflow-auto border rounded-lg bg-white shadow">
    <table className="min-w-[950px] text-xs md:text-sm w-full">
      <thead>
        <tr className="bg-blue-50 text-blue-800 font-semibold">
          <th className="px-2 py-1">Fila</th>
          <th className="px-2 py-1">Imagen</th>
          <th className="px-2 py-1">Nombre</th>
          <th className="px-2 py-1">Código</th>
          <th className="px-2 py-1">Descripción</th>
          <th className="px-2 py-1">Categoría</th>
          <th className="px-2 py-1">Precio Unitario</th>
          <th className="px-2 py-1">Precio Mayor</th>
          <th className="px-2 py-1">Cantidad Mín. Mayorista</th>
          <th className="px-2 py-1">Etiquetas</th>
          <th className="px-2 py-1 text-red-600">Error</th>
        </tr>
      </thead>
      <tbody>
        {importRows?.map((row, idx) => (
          <tr key={idx} className={row.error ? "bg-red-50" : "bg-green-50"}>
            <td className="px-2 py-1">{row.rowNumber}</td>
            <td className="px-2 py-1">
              {row.data.image ? (
                <img
                  src={row.data.image}
                  alt="img"
                  className="w-10 h-10 object-cover rounded border"
                  onError={e => ((e.target as HTMLImageElement).src = "/placeholder.svg")}
                />
              ) : (
                <span className="text-xs text-gray-400 italic">Sin imagen</span>
              )}
            </td>
            <td className="px-2 py-1">{row.data.name}</td>
            <td className="px-2 py-1">{row.data.code}</td>
            <td className="px-2 py-1">{row.data.description}</td>
            <td className="px-2 py-1">{row.data.category}</td>
            <td className="px-2 py-1">{row.data.unitPrice}</td>
            <td className="px-2 py-1">{row.data.wholesalePrice}</td>
            <td className="px-2 py-1">{row.data.minimumWholesaleQuantity}</td>
            <td className="px-2 py-1">{row.data.tags.join(", ")}</td>
            <td className="px-2 py-1 text-xs font-medium text-red-600">
              {row.error || "-"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
