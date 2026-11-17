import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isAllowedPanelEmail } from "@/lib/supabase/authorization";
import { createServerComponentClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/supabase/database.types";

const columns = [
  "N° cotización",
  "Fecha de registro (UTC)",
  "Nombre",
  "Correo electrónico",
  "Teléfono",
  "Contacto verificado",
  "Equipos seleccionados",
  "Subtotal (CLP)",
  "Descuento (%)",
  "Descuento (CLP)",
  "IVA (CLP)",
  "Total (CLP)",
  "Equipos por cotizar",
];

function isRecord(value: Json): value is { [key: string]: Json | undefined } {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function itemDetails(value: Json): string {
  if (!Array.isArray(value)) return "Detalle no disponible";

  return value
    .map((item) => {
      if (
        !isRecord(item) ||
        typeof item.name !== "string" ||
        typeof item.quantity !== "number"
      ) {
        return null;
      }

      const descriptors = [item.brand, item.category].filter(
        (part): part is string => typeof part === "string" && part.length > 0,
      );
      const unitPrice =
        typeof item.unit_price === "string"
          ? `${item.unit_price} CLP c/u`
          : "Por cotizar";
      const lineTotal =
        typeof item.line_total === "string"
          ? `${item.line_total} CLP total`
          : "Por cotizar";
      return `${item.quantity} × ${item.name}${descriptors.length ? ` (${descriptors.join(" / ")})` : ""} — ${unitPrice}; ${lineTotal}`;
    })
    .filter((item): item is string => item !== null)
    .join(" | ");
}

function csvCell(value: string | number | boolean) {
  const text = String(value);
  const safeText = /^[\s]*[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safeText.replaceAll('"', '""')}"`;
}

export async function GET() {
  const authClient = await createServerComponentClient();
  const { data: authData, error: authError } = await authClient.auth.getClaims();
  if (authError || !authData?.claims?.sub) {
    return new Response("No autorizado.", { status: 401 });
  }
  if (!isAllowedPanelEmail(authData.claims.email)) {
    return new Response("Acceso denegado.", { status: 403 });
  }

  const supabase = createSupabaseAdminClient();
  const { data: quotes, error } = await supabase
    .from("quote_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Could not export panel quote requests", {
      code: error.code,
    });
    return new Response("No se pudieron exportar las cotizaciones.", {
      status: 500,
    });
  }

  const rows = [
    columns,
    ...quotes.map((quote) => [
      quote.id,
      quote.created_at,
      quote.customer_name,
      quote.customer_email,
      quote.customer_phone,
      quote.contact_verified ? "Sí" : "No",
      itemDetails(quote.quote_items),
      quote.subtotal,
      quote.discount_percent,
      quote.discount_amount,
      quote.tax_amount,
      quote.total,
      quote.unpriced_items,
    ]),
  ];
  const csv = `\uFEFF${rows.map((row) => row.map(csvCell).join(";")).join("\r\n")}`;

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="cotizaciones.csv"',
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
