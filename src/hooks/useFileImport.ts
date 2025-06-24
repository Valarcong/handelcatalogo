import { useState } from "react";
import { Product } from "@/types/product";
import { ImportPreviewRow, REQUIRED_COLUMNS } from "@/utils/importExportUtils";
import * as XLSX from "xlsx";
import { useToast } from "@/hooks/use-toast";
import { useProducts } from "@/hooks/useProducts";

export function useFileImport(products: Product[]) {
  const { toast } = useToast();
  const { addProduct, refreshData } = useProducts();

  const [importRows, setImportRows] = useState<ImportPreviewRow[] | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ success: number; error: number }>({ success: 0, error: 0 });

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportRows(null);
    setImportResult({ success: 0, error: 0 });

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        if (rows.length < 2) throw new Error("El archivo no contiene datos");

        const header = rows[0].map((h: any) => (h || "").toString().trim());
        // La columna Imagen URL es opcional pero si está, se valida como string/url (no error si está vacía)
        const missing = REQUIRED_COLUMNS.filter((col) =>
          col === "Imagen URL" ? false : !header.includes(col)
        );
        if (missing.length) {
          toast({
            title: "Columnas incorrectas",
            description: `Faltan columnas obligatorias: ${missing.join(", ")}`,
            variant: "destructive",
          });
          return;
        }

        const preview: ImportPreviewRow[] = [];
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (row.length === 0 || row.every((cell: any) => !cell)) continue; // omite vacías

          const rowObj: Record<string, string> = {};
          header.forEach((col, j) => {
            rowObj[col] = row[j] ? row[j].toString() : "";
          });

          let error: string | null = null;
          if (!rowObj["Nombre"]) error = "Nombre vacío";
          if (!rowObj["Código"]) error = "Código vacío";
          if (!rowObj["Categoría"]) error = "Categoría vacía";
          if (!rowObj["Precio Unitario"] || isNaN(Number(rowObj["Precio Unitario"])))
            error = "Precio Unitario inválido";
          if (!rowObj["Precio Mayor"] || isNaN(Number(rowObj["Precio Mayor"])))
            error = "Precio Mayor inválido";
          if (
            !rowObj["Cantidad Mínima Mayorista"] ||
            isNaN(Number(rowObj["Cantidad Mínima Mayorista"])) ||
            Number(rowObj["Cantidad Mínima Mayorista"]) < 1
          )
            error = "Cantidad mínima para mayorista inválida";
          if (preview.some((prev) => prev.data.code === rowObj["Código"])) error = "Código duplicado en archivo";
          if (products.some((prod) => prod.code === rowObj["Código"]))
            error = "Código ya existe en la base de datos";

          // Imagen: tomar de la columna si existe
          const imageValue =
            typeof rowObj["Imagen URL"] === "string" && rowObj["Imagen URL"].trim()
              ? rowObj["Imagen URL"].trim()
              : "";

          const brandValue = rowObj["Marca"]?.trim() || "HANDEL";

          // Características: separar por punto y coma
          const featuresValue = typeof rowObj["Características"] === "string"
            ? rowObj["Características"].split(";").map((f: string) => f.trim()).filter(Boolean)
            : [];
          console.log('Características (raw):', rowObj["Características"], '->', featuresValue);

          // Especificaciones Técnicas: clave:valor separadas por punto y coma
          const techSpecsValue = typeof rowObj["Especificaciones Técnicas"] === "string" && rowObj["Especificaciones Técnicas"].trim()
            ? rowObj["Especificaciones Técnicas"].split(";").reduce((acc: Record<string, string>, pair: string) => {
                const [key, value] = pair.split(":");
                if (key && value) acc[key.trim()] = value.trim();
                return acc;
              }, {})
            : {};
          console.log('Especificaciones Técnicas (raw):', rowObj["Especificaciones Técnicas"], '->', techSpecsValue);

          const productData = {
            name: rowObj["Nombre"],
            code: rowObj["Código"],
            description: rowObj["Descripción"],
            image: imageValue,
            brand: brandValue,
            category: rowObj["Categoría"],
            unitPrice: Number(rowObj["Precio Unitario"]),
            wholesalePrice: Number(rowObj["Precio Mayor"]),
            minimumWholesaleQuantity: Number(rowObj["Cantidad Mínima Mayorista"]) || 10,
            tags:
              typeof rowObj["Etiquetas"] === "string"
                ? rowObj["Etiquetas"].split(",").map((t) => t.trim()).filter(Boolean)
                : [],
            features: featuresValue,
            technicalSpecs: techSpecsValue,
          };
          console.log('Producto procesado:', productData);

          preview.push({
            rowNumber: i + 1,
            data: productData,
            error,
          });
        }

        setImportRows(preview);

        toast({
          title: "Archivo preparado",
          description: "Revisa los datos antes de confirmar la importación.",
        });
      } catch (error) {
        toast({
          title: "Error de importación",
          description: "No se pudo procesar el archivo. ¿Formato válido?",
          variant: "destructive",
        });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleImportConfirm = async () => {
    if (!importRows) return;
    setIsImporting(true);
    setImportResult({ success: 0, error: 0 });

    let success = 0;
    let error = 0;
    for (const row of importRows) {
      if (row.error) {
        error++;
        continue;
      }
      try {
        await addProduct(row.data);
        success++;
      } catch (e) {
        error++;
      }
    }
    setIsImporting(false);
    setImportResult({ success, error });

    if (success > 0) {
      toast({
        title: "Importación completa",
        description: `${success} productos importados correctamente.`,
      });
      refreshData();
    } else {
      toast({
        title: "Ningún producto importado",
        description: "Verifica los errores de las filas.",
        variant: "destructive",
      });
    }
    setImportRows(null); // limpia preview tras importar
  };

  return {
    importRows,
    setImportRows,
    isImporting,
    importResult,
    handleFileImport,
    handleImportConfirm,
  };
}
