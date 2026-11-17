import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requirePanelAdmin } from "@/lib/supabase/require-panel-admin";
import { PanelHeader } from "../panel-header";
import { DeleteProductButton } from "./delete-product-button";

export const instant = false;

const notices: Record<string, string> = {
  created: "El ecógrafo se agregó correctamente.",
  updated: "Los cambios se guardaron correctamente.",
  deleted: "El ecógrafo se eliminó correctamente.",
};

const clpFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

type CatalogPageProps = {
  searchParams: Promise<{ status?: string }>;
};

async function CatalogContent({ searchParams }: CatalogPageProps) {
  await connection();
  const claims = await requirePanelAdmin();
  const { status } = await searchParams;
  const supabase = createSupabaseAdminClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("name");

  if (error) {
    console.error("Could not load panel products", {
      code: error.code,
    });
    throw new Error("Could not load the panel product catalog.");
  }

  return (
    <main className="mx-auto min-h-[65vh] max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-blue-100 bg-white p-6 shadow-[0_24px_65px_rgba(15,23,42,0.08)] sm:p-9">
        <PanelHeader
          active="products"
          email={typeof claims.email === "string" ? claims.email : ""}
        />
        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">
              Administración del catálogo
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
              Catálogo completo
            </h1>
          </div>
          <Link
            href="/panel/productos/nuevo"
            className="luxury-button rounded-full px-5 py-2.5 text-sm font-bold text-white"
          >
            + Agregar ecógrafo
          </Link>
        </div>
        {status && notices[status] ? (
          <p
            role="status"
            className="mt-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800"
          >
            {notices[status]}
          </p>
        ) : null}
        <div className="mt-6 flex items-center justify-between gap-3">
          <h2 className="text-lg font-black text-slate-900">Ecógrafos</h2>
          <span className="text-sm text-slate-500">{products.length} equipos</span>
        </div>
        {products.length ? (
          <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[760px] divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th scope="col" className="px-4 py-3 font-bold">Modelo</th>
                  <th scope="col" className="px-4 py-3 font-bold">Marca</th>
                  <th scope="col" className="px-4 py-3 font-bold">Categoría</th>
                  <th scope="col" className="px-4 py-3 text-right font-bold">Precio</th>
                  <th scope="col" className="px-4 py-3 font-bold">Disponibilidad</th>
                  <th scope="col" className="px-4 py-3 text-right font-bold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-4 py-4">
                      <span className="block font-bold text-slate-900">{product.name}</span>
                      <span className="mt-1 block text-xs text-slate-500">{product.slug}</span>
                    </td>
                    <td className="px-4 py-4 text-slate-700">{product.brand}</td>
                    <td className="px-4 py-4 text-slate-700">{product.category}</td>
                    <td className="px-4 py-4 text-right font-semibold text-slate-900">
                      {product.price === null ? (
                        <span className="font-normal text-slate-500">Sin precio</span>
                      ) : (
                        clpFormatter.format(product.price)
                      )}
                    </td>
                    <td className="px-4 py-4 text-slate-700">{product.availability}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/panel/productos/${product.id}`}
                          className="rounded-full border border-blue-200 px-3 py-1.5 text-xs font-bold text-blue-800 hover:bg-blue-50"
                        >
                          Editar
                        </Link>
                        <DeleteProductButton id={product.id} name={product.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-300 p-10 text-center">
            <p className="font-bold text-slate-800">Todavía no hay ecógrafos en el catálogo.</p>
            <p className="mt-2 text-sm text-slate-600">
              Agrega el primer equipo para publicarlo en el sitio.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default function CatalogPage(props: CatalogPageProps) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto min-h-[65vh] max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <section className="rounded-[2rem] border border-blue-100 bg-white p-8 text-slate-600 shadow-sm">
            Cargando catálogo...
          </section>
        </main>
      }
    >
      <CatalogContent {...props} />
    </Suspense>
  );
}
