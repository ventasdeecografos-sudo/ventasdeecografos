"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAllowedPanelEmail } from "@/lib/supabase/authorization";
import { createServerActionClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { parseProductFormData } from "./fields";
import type {
  ProductActionState,
  ProductImageUploadState,
  ProductImageUploadTarget,
} from "./types";

const PRODUCT_IMAGES_BUCKET = "product-images";
const MAX_IMAGE_SIZE = 8 * 1024 * 1024;
const IMAGE_TYPES = {
  "image/avif": "avif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

async function requirePanelAdmin() {
  const supabase = await createServerActionClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub || !isAllowedPanelEmail(data.claims.email)) {
    redirect("/panel/login");
  }
}

function revalidateCatalog(slug: string) {
  revalidatePath("/");
  revalidatePath("/servicios");
  revalidatePath(`/product/${slug}`);
  revalidatePath("/panel");
  revalidatePath("/panel/productos");
}

export async function createProductImageUploadUrls(
  target: ProductImageUploadTarget,
  files: { type: string; size: number }[],
): Promise<ProductImageUploadState> {
  await requirePanelAdmin();

  const maxFiles = target === "main" ? 1 : 20;
  if (
    (target !== "main" && target !== "gallery") ||
    !Array.isArray(files) ||
    files.length < 1 ||
    files.length > maxFiles
  ) {
    return { error: "Selecciona una cantidad válida de imágenes." };
  }

  const validFiles: { extension: string }[] = [];
  for (const file of files) {
    if (
      !file ||
      typeof file.type !== "string" ||
      !Object.hasOwn(IMAGE_TYPES, file.type) ||
      !Number.isSafeInteger(file.size) ||
      file.size <= 0 ||
      file.size > MAX_IMAGE_SIZE
    ) {
      return {
        error: "Usa imágenes JPG, PNG, WebP o AVIF de hasta 8 MB cada una.",
      };
    }
    validFiles.push({
      extension: IMAGE_TYPES[file.type as keyof typeof IMAGE_TYPES],
    });
  }

  const supabase = createSupabaseAdminClient();
  const results = await Promise.all(
    validFiles.map(async (file) => {
      const path = `products/${target}/${crypto.randomUUID()}.${file.extension}`;
      const { data, error } = await supabase.storage
        .from(PRODUCT_IMAGES_BUCKET)
        .createSignedUploadUrl(path);

      if (error) return { error };

      const { data: publicUrl } = supabase.storage
        .from(PRODUCT_IMAGES_BUCKET)
        .getPublicUrl(path);
      return {
        upload: {
          path: data.path,
          token: data.token,
          publicUrl: publicUrl.publicUrl,
        },
      };
    }),
  );

  const failedUpload = results.find((result) => "error" in result);
  if (failedUpload && "error" in failedUpload && failedUpload.error) {
    console.error("Could not create product image upload URL", {
      message: failedUpload.error.message,
    });
    return {
      error: "No se pudieron preparar las imágenes para subir. Inténtalo nuevamente.",
    };
  }

  return {
    uploads: results.flatMap((result) =>
      "upload" in result && result.upload ? [result.upload] : [],
    ),
  };
}

export async function saveProductAction(
  _previousState: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  await requirePanelAdmin();

  const parsed = parseProductFormData(formData);
  if ("error" in parsed) return { error: parsed.error };

  const rawId = formData.get("id");
  const id =
    typeof rawId === "string" && /^\d+$/.test(rawId) ? Number(rawId) : null;
  if (rawId !== null && (!id || !Number.isSafeInteger(id))) {
    return { error: "No se pudo identificar el ecógrafo que quieres guardar." };
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = id
    ? await supabase
        .from("products")
        .update(parsed.product)
        .eq("id", id)
        .select("id")
        .maybeSingle()
    : await supabase.from("products").insert(parsed.product).select("id").single();

  if (error) {
    if (error.code === "23505") {
      return { error: "Ya existe un ecógrafo con ese slug. Elige otro." };
    }
    console.error("Could not save product in Supabase", {
      code: error.code,
    });
    return { error: "No se pudo guardar el ecógrafo. Inténtalo nuevamente." };
  }
  if (!data) return { error: "El ecógrafo ya no existe o fue eliminado." };

  revalidateCatalog(parsed.product.slug);
  redirect(`/panel/productos?status=${id ? "updated" : "created"}`);
}

export async function deleteProductAction(
  _previousState: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  await requirePanelAdmin();

  const rawId = formData.get("id");
  const id =
    typeof rawId === "string" && /^\d+$/.test(rawId) ? Number(rawId) : null;
  if (!id || !Number.isSafeInteger(id)) {
    return { error: "No se pudo identificar el ecógrafo que quieres eliminar." };
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)
    .select("slug")
    .maybeSingle();

  if (error) {
    console.error("Could not delete product from Supabase", {
      code: error.code,
    });
    return { error: "No se pudo eliminar el ecógrafo. Inténtalo nuevamente." };
  }
  if (!data) return { error: "El ecógrafo ya no existe o fue eliminado." };

  revalidateCatalog(data.slug);
  redirect("/panel/productos?status=deleted");
}
