import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductForm } from "../product-form";
import { requirePanelAdmin } from "@/lib/supabase/require-panel-admin";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const instant = false;

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePanelAdmin();
  const { id: rawId } = await params;
  const id = /^\d+$/.test(rawId) ? Number(rawId) : Number.NaN;
  if (!Number.isSafeInteger(id) || id <= 0) notFound();

  const supabase = createSupabaseAdminClient();
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Could not load product for editing", {
      code: error.code,
    });
    throw new Error("Could not load the product for editing.");
  }
  if (!product) notFound();

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/panel/productos" className="text-sm font-bold text-blue-700 hover:text-blue-900">
        ← Volver al catálogo
      </Link>
      <section className="mt-5 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">
          Catálogo
        </p>
        <h1 className="mt-2 text-3xl font-black text-slate-900">
          Editar {product.name}
        </h1>
        <div className="mt-8">
          <ProductForm product={product} />
        </div>
      </section>
    </main>
  );
}
