
import React, { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  disabled?: boolean;
  label?: string;
  className?: string;
}

const BUCKET = "products";

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  folder = "main",
  disabled,
  label = "Imagen",
  className,
}) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string>(value);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Nombre único
      const ext = file.name.split('.').pop() || 'jpg';
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;

      // Subir archivo a Supabase Storage
      const { data, error } = await supabase.storage.from(BUCKET).upload(fileName, file, {
        upsert: false,
        cacheControl: "3600",
      });

      if (error) throw error;

      // Obtener url pública
      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
      if (urlData?.publicUrl) {
        setPreview(urlData.publicUrl);
        onChange(urlData.publicUrl);
      }
    } catch (err: any) {
      alert("Error subiendo imagen: " + err.message);
      console.error("Error uploading image:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <div className="flex gap-4 items-center">
        <div className="relative w-24 h-24 rounded bg-gray-100 overflow-hidden border border-gray-200 flex items-center justify-center">
          <img
            src={preview || "/placeholder.svg"}
            alt="Imagen producto"
            className="object-cover w-full h-full"
            onError={e => ((e.target as HTMLImageElement).src = "/placeholder.svg")}
          />
        </div>
        <div>
          <Button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading || disabled}
            variant="outline"
          >
            {uploading ? "Subiendo..." : "Seleccionar imagen"}
          </Button>
          <input
            type="file"
            accept="image/*"
            ref={inputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
            disabled={uploading || disabled}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
