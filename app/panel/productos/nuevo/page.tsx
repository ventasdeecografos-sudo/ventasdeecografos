import Link from "next/link";
import { ProductForm } from "../product-form";
import { requirePanelAdmin } from "@/lib/supabase/require-panel-admin";

export const instant = false;

export default async function NewProductPage() {
  await requirePanelAdmin();

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
          Agregar ecógrafo
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Completa la información del equipo. La marca y la categoría son editables y
          también quedarán disponibles como filtros en el catálogo.
        </p>
        <div className="mt-8">
          <ProductForm />
        </div>
      </section>
    </main>
  );
}
