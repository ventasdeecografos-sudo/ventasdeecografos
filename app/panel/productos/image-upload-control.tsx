"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { createProductImageUploadUrls } from "./actions";
import type { ProductImageUploadTarget } from "./types";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_IMAGE_SIZE = 8 * 1024 * 1024;

export function ImageUploadControl({
  target,
  onUploaded,
  onBusyChange,
}: {
  target: ProductImageUploadTarget;
  onUploaded: (urls: string[]) => void;
  onBusyChange: (busy: boolean) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleFiles(files: FileList | null) {
    const selectedFiles = Array.from(files ?? []);
    if (selectedFiles.length === 0) return;

    setMessage("");
    const allowedCount = target === "main" ? 1 : 20;
    const invalidFile = selectedFiles.find(
      (file) =>
        !IMAGE_TYPES.includes(file.type) ||
        file.size === 0 ||
        file.size > MAX_IMAGE_SIZE,
    );
    if (
      selectedFiles.length > allowedCount ||
      (target === "main" && selectedFiles.length !== 1)
    ) {
      setMessage(
        target === "main"
          ? "Selecciona solo una imagen principal."
          : "Puedes subir hasta 20 imágenes de galería a la vez.",
      );
      return;
    }
    if (invalidFile) {
      setMessage("Usa imágenes JPG, PNG, WebP o AVIF de hasta 8 MB cada una.");
      return;
    }

    setIsUploading(true);
    onBusyChange(true);
    try {
      const result = await createProductImageUploadUrls(
        target,
        selectedFiles.map(({ type, size }) => ({ type, size })),
      );
      if ("error" in result) {
        setMessage(result.error);
        return;
      }

      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
      if (!url || !publishableKey) {
        throw new Error("Falta configurar la conexión con Supabase.");
      }

      const supabase = createClient<Database>(url, publishableKey);
      const uploaded = await Promise.allSettled(
        result.uploads.map((upload, index) =>
          supabase.storage
            .from("product-images")
            .uploadToSignedUrl(upload.path, upload.token, selectedFiles[index], {
              contentType: selectedFiles[index].type,
              upsert: false,
            })
            .then(({ error }) => {
              if (error) throw error;
              return upload.publicUrl;
            }),
        ),
      );
      const uploadedUrls = uploaded.flatMap((item) =>
        item.status === "fulfilled" ? [item.value] : [],
      );
      if (uploadedUrls.length > 0) onUploaded(uploadedUrls);

      if (uploadedUrls.length !== selectedFiles.length) {
        console.error("Could not upload all product images", {
          failedCount: selectedFiles.length - uploadedUrls.length,
        });
        setMessage(
          uploadedUrls.length > 0
            ? "Algunas imágenes no se pudieron subir; las demás ya se agregaron."
            : "No se pudieron subir las imágenes. Inténtalo nuevamente.",
        );
        return;
      }

      setMessage(
        uploadedUrls.length === 1
          ? "Imagen subida y agregada."
          : `${uploadedUrls.length} imágenes subidas y agregadas.`,
      );
    } catch (error) {
      console.error("Could not upload product images", error);
      setMessage("No se pudieron subir las imágenes. Inténtalo nuevamente.");
    } finally {
      setIsUploading(false);
      onBusyChange(false);
    }
  }

  return (
    <div className="mt-2">
      <label className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-800 hover:bg-blue-100">
        {isUploading ? "Subiendo imágenes…" : "Seleccionar archivo"}
        <input
          type="file"
          accept={IMAGE_TYPES.join(",")}
          multiple={target === "gallery"}
          disabled={isUploading}
          className="sr-only"
          onChange={(event) => {
            void handleFiles(event.currentTarget.files);
            event.currentTarget.value = "";
          }}
        />
      </label>
      <p className="mt-1 text-xs font-normal text-slate-500">
        JPG, PNG, WebP o AVIF; hasta 8 MB por archivo
        {target === "gallery" ? ", máximo 20 por selección" : ""}.
      </p>
      {message ? (
        <p role="status" className="mt-2 text-xs font-medium text-slate-600">
          {message}
        </p>
      ) : null}
    </div>
  );
}
