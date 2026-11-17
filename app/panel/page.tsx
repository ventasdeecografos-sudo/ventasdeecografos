import { connection } from "next/server";
import { Suspense } from "react";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requirePanelAdmin } from "@/lib/supabase/require-panel-admin";
import type { Database, Json } from "@/lib/supabase/database.types";
import { PanelHeader } from "./panel-header";

export const instant = false;

type QuoteRequest = Database["public"]["Tables"]["quote_requests"]["Row"];
type SavedQuoteItem = {
  name: string;
  brand: string | null;
  category: string | null;
  quantity: number;
  unitPrice: bigint | null;
  lineTotal: bigint | null;
};

const clpFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

function formatClp(value: number | bigint) {
  return clpFormatter.format(value);
}

function formatCreatedAt(value: string) {
  const date = value.slice(0, 10);
  const time = value.slice(11, 16);
  const timezone = value.endsWith("Z") ? "UTC" : value.slice(-6);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) {
    return value;
  }
  return `${date.slice(8, 10)}/${date.slice(5, 7)}/${date.slice(0, 4)} ${time} ${timezone}`;
}

function isRecord(value: Json): value is { [key: string]: Json | undefined } {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseAmount(value: Json | undefined): bigint | null {
  if (value === null) return null;
  if (typeof value !== "string" || !/^\d+$/.test(value)) return null;
  return BigInt(value);
}

function parseQuoteItems(value: Json): SavedQuoteItem[] | null {
  if (!Array.isArray(value)) return null;
  const items: SavedQuoteItem[] = [];

  for (const item of value) {
    if (
      !isRecord(item) ||
      typeof item.name !== "string" ||
      typeof item.quantity !== "number" ||
      !Number.isSafeInteger(item.quantity) ||
      item.quantity < 1
    ) {
      return null;
    }

    items.push({
      name: item.name,
      brand: typeof item.brand === "string" ? item.brand : null,
      category: typeof item.category === "string" ? item.category : null,
      quantity: item.quantity,
      unitPrice: parseAmount(item.unit_price),
      lineTotal: parseAmount(item.line_total),
    });
  }

  return items;
}

async function PanelContent() {
  await connection();
  const claims = await requirePanelAdmin();
  const supabase = createSupabaseAdminClient();
  const { data: quoteRequests, error: quoteRequestsError } = await supabase
    .from("quote_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (quoteRequestsError) {
    console.error("Could not load panel quote requests", {
      code: quoteRequestsError.code,
    });
    throw new Error("Could not load the panel quote requests.");
  }

  const uniqueCustomers = new Set(
    quoteRequests.map((quote) => quote.customer_email.toLowerCase()),
  );
  const estimatedTotal = quoteRequests.reduce(
    (sum, quote) => sum + BigInt(quote.total),
    BigInt(0),
  );

  return (
    <main className="mx-auto min-h-[65vh] max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-blue-100 bg-white p-6 shadow-[0_24px_65px_rgba(15,23,42,0.08)] sm:p-9">
        <PanelHeader
          active="quotes"
          email={typeof claims.email === "string" ? claims.email : ""}
        />
        <div className="mt-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">
              Clientes potenciales
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
              Cotizaciones recibidas
            </h1>
          </div>
        </div>
        <section className="mt-10 border-t border-slate-200 pt-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-900">Resumen de cotizaciones</h2>
              <p className="mt-1 text-sm text-slate-500">
                {quoteRequests.length} solicitudes registradas
              </p>
            </div>
            <a
              href="/panel/cotizaciones/exportar"
              className="rounded-full border border-emerald-200 px-4 py-2.5 text-sm font-bold text-emerald-800 hover:border-emerald-400 hover:bg-emerald-50"
            >
              Descargar tabla Excel
            </a>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-600">Clientes</p>
              <p className="mt-2 text-3xl font-black text-slate-900">{uniqueCustomers.size}</p>
              <p className="mt-1 text-xs text-slate-500">Correos únicos</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-600">Cotizaciones</p>
              <p className="mt-2 text-3xl font-black text-slate-900">{quoteRequests.length}</p>
              <p className="mt-1 text-xs text-slate-500">Solicitudes con equipos seleccionados</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-600">Monto estimado total</p>
              <p className="mt-2 text-2xl font-black text-slate-900">
                {formatClp(estimatedTotal)}
              </p>
              <p className="mt-1 text-xs text-slate-500">Suma de los totales guardados</p>
            </div>
          </div>

          {quoteRequests.length ? (
            <div className="mt-6 space-y-3">
              {quoteRequests.map((quote: QuoteRequest) => {
                const items = parseQuoteItems(quote.quote_items);

                return (
                  <details
                    key={quote.id}
                    className="group rounded-2xl border border-slate-200 bg-white open:border-blue-200 open:shadow-sm"
                  >
                    <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-4 rounded-2xl p-4 hover:bg-slate-50 sm:p-5 [&::-webkit-details-marker]:hidden">
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900">{quote.customer_name}</p>
                        <p className="mt-1 break-all text-sm text-slate-600">
                          {quote.customer_email}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Solicitud #{quote.id} · {formatCreatedAt(quote.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-black text-slate-900">{formatClp(quote.total)}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            {items ? `${items.length} equipos` : "Detalle no disponible"}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-blue-800 group-open:rotate-180" aria-hidden="true">
                          ▼
                        </span>
                      </div>
                    </summary>
                    <div className="border-t border-slate-100 px-4 py-5 sm:px-5">
                      <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                        <p><span className="font-semibold text-slate-500">Teléfono:</span> <span className="text-slate-900">{quote.customer_phone}</span></p>
                        <p>
                          <span className="font-semibold text-slate-500">Contacto:</span>{" "}
                          <span className="text-slate-900">
                            {quote.contact_verified ? "Verificado" : "No verificado"}
                          </span>
                        </p>
                        <p><span className="font-semibold text-slate-500">Descuento:</span> <span className="text-slate-900">{quote.discount_percent}%</span></p>
                        <p><span className="font-semibold text-slate-500">Equipos por cotizar:</span> <span className="text-slate-900">{quote.unpriced_items}</span></p>
                      </div>

                      {items ? (
                        <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200">
                          <table className="w-full min-w-[650px] divide-y divide-slate-200 text-left text-sm">
                            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                              <tr>
                                <th scope="col" className="px-4 py-3 font-bold">Equipo</th>
                                <th scope="col" className="px-4 py-3 font-bold">Marca / especialidad</th>
                                <th scope="col" className="px-4 py-3 text-right font-bold">Cantidad</th>
                                <th scope="col" className="px-4 py-3 text-right font-bold">Precio unitario</th>
                                <th scope="col" className="px-4 py-3 text-right font-bold">Subtotal</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {items.map((item, index) => (
                                <tr key={`${item.name}-${index}`}>
                                  <td className="px-4 py-3 font-semibold text-slate-900">{item.name}</td>
                                  <td className="px-4 py-3 text-slate-600">
                                    {[item.brand, item.category].filter(Boolean).join(" · ") || "—"}
                                  </td>
                                  <td className="px-4 py-3 text-right text-slate-700">{item.quantity}</td>
                                  <td className="px-4 py-3 text-right text-slate-700">
                                    {item.unitPrice === null ? "Por cotizar" : formatClp(item.unitPrice)}
                                  </td>
                                  <td className="px-4 py-3 text-right font-semibold text-slate-900">
                                    {item.lineTotal === null ? "Por cotizar" : formatClp(item.lineTotal)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
                          No se pudo interpretar el detalle de los equipos de esta cotización.
                        </p>
                      )}

                      <dl className="mt-5 grid gap-2 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-2 lg:grid-cols-5">
                        <div>
                          <dt className="text-slate-500">Subtotal</dt>
                          <dd className="font-bold text-slate-900">{formatClp(quote.subtotal)}</dd>
                        </div>
                        <div>
                          <dt className="text-slate-500">Descuento ({quote.discount_percent}%)</dt>
                          <dd className="font-bold text-slate-900">−{formatClp(quote.discount_amount)}</dd>
                        </div>
                        <div>
                          <dt className="text-slate-500">IVA</dt>
                          <dd className="font-bold text-slate-900">{formatClp(quote.tax_amount)}</dd>
                        </div>
                        <div>
                          <dt className="text-slate-500">Total</dt>
                          <dd className="font-black text-emerald-800">{formatClp(quote.total)}</dd>
                        </div>
                        <div>
                          <dt className="text-slate-500">Fecha de registro</dt>
                          <dd className="font-semibold text-slate-900">
                            {formatCreatedAt(quote.created_at)}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </details>
                );
              })}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-10 text-center">
              <p className="font-bold text-slate-800">Todavía no hay cotizaciones registradas.</p>
              <p className="mt-2 text-sm text-slate-600">
                Las solicitudes aparecerán aquí cuando un cliente agregue equipos a su cotización.
              </p>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default function PanelPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto min-h-[65vh] max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <section className="rounded-[2rem] border border-blue-100 bg-white p-8 text-slate-600 shadow-sm">
            Cargando panel...
          </section>
        </main>
      }
    >
      <PanelContent />
    </Suspense>
  );
}
