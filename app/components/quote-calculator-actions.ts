"use server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/lib/supabase/database.types";
import type { QuoteRequestState } from "./quote-calculator-types";

const MAX_QUOTE_ITEMS = 30;
const MAX_QUANTITY = 9999;
const MAX_AMOUNT = BigInt(Number.MAX_SAFE_INTEGER);

type SubmittedItem = { slug: string; quantity: number };
type QuoteSelectionInput = {
  requestToken: string;
  name: string;
  email: string;
  phone: string;
  consent: boolean;
  discount: string;
  items: SubmittedItem[];
  language: "es" | "en";
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseInput(value: unknown): QuoteSelectionInput | null {
  if (!isRecord(value)) return null;
  const { requestToken, name, email, phone, consent, discount, items, language } = value;
  if (
    typeof requestToken !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestToken) ||
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof phone !== "string" ||
    typeof consent !== "boolean" ||
    typeof discount !== "string" ||
    !Array.isArray(items) ||
    (language !== "es" && language !== "en")
  ) {
    return null;
  }

  const parsedItems: SubmittedItem[] = [];
  const seen = new Set<string>();
  for (const item of items) {
    if (
      !isRecord(item) ||
      typeof item.slug !== "string" ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug) ||
      typeof item.quantity !== "number" ||
      !Number.isSafeInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > MAX_QUANTITY ||
      seen.has(item.slug)
    ) {
      return null;
    }
    seen.add(item.slug);
    parsedItems.push({ slug: item.slug, quantity: item.quantity });
  }

  if (parsedItems.length > MAX_QUOTE_ITEMS) return null;
  return {
    requestToken,
    name,
    email,
    phone,
    consent,
    discount,
    items: parsedItems,
    language,
  };
}

function parseDiscount(value: string) {
  if (!/^(?:100(?:\.0{1,2})?|(?:\d|[1-9]\d)(?:\.\d{1,2})?)$/.test(value)) {
    return null;
  }
  const [whole, fraction = ""] = value.split(".");
  return Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
}

function phoneIsValid(value: string) {
  const normalized = value.replace(/[ ().-]/g, "");
  return /^\+[1-9]\d{7,14}$/.test(normalized) ? normalized : null;
}

function isValidEmail(value: string) {
  return (
    value.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) &&
    !/[\r\n]/.test(value)
  );
}

export async function saveQuoteSelection(input: unknown): Promise<QuoteRequestState> {
  const selection = parseInput(input);
  if (!selection) {
    return { error: "La selección no es válida. Revisa los datos e inténtalo nuevamente." };
  }
  const { requestToken, name, email, phone: rawPhone, consent, discount, items, language } = selection;
  const message = (spanish: string, translated: string) =>
    language === "en" ? translated : spanish;

  if (name.length < 2 || name.length > 120 || /[\u0000-\u001f]/.test(name)) {
    return {
      error: message(
        "Ingresa un nombre válido (2 a 120 caracteres).",
        "Enter a valid name (2 to 120 characters).",
      ),
    };
  }
  if (!isValidEmail(email)) {
    return {
      error: message("Ingresa un correo electrónico válido.", "Enter a valid email address."),
    };
  }
  const normalizedEmail = email.toLowerCase();
  const phone = phoneIsValid(rawPhone);
  if (!phone) {
    return {
      error: message(
        "Ingresa un teléfono internacional válido, por ejemplo +56912345678.",
        "Enter a valid international phone number, for example +56912345678.",
      ),
    };
  }
  if (!consent) {
    return {
      error: message(
        "Debes aceptar el uso de tus datos para responder esta solicitud.",
        "You must consent to the use of your data to respond to this request.",
      ),
    };
  }

  const discountBasisPoints = parseDiscount(discount);
  if (discountBasisPoints === null) {
    return {
      error: message(
        "Ingresa un descuento entre 0 y 100%.",
        "Enter a discount between 0 and 100%.",
      ),
    };
  }

  const supabase = createSupabaseAdminClient();
  if (items.length === 0) {
    const { error: deleteError } = await supabase
      .from("quote_requests")
      .delete()
      .eq("request_token", requestToken);
    if (deleteError) {
      console.error("Could not clear quote selection", { code: deleteError.code });
      return {
        error: message(
          "No se pudo actualizar la cotización. Inténtalo nuevamente.",
          "The quote could not be updated. Please try again.",
        ),
      };
    }
    return { success: true, requestToken };
  }

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("slug, name, brand, category, price")
    .in("slug", items.map((item) => item.slug));

  if (productsError) {
    console.error("Could not load products for quote selection", {
      code: productsError.code,
    });
    return {
      error: message(
        "No se pudo validar el catálogo. Inténtalo nuevamente.",
        "The catalog could not be validated. Please try again.",
      ),
    };
  }
  if (!products || products.length !== items.length) {
    return {
      error: message(
        "Uno de los ecógrafos seleccionados ya no está disponible. Actualiza la página.",
        "A selected ultrasound system is no longer available. Refresh the page.",
      ),
    };
  }

  const productsBySlug = new Map(products.map((product) => [product.slug, product]));
  const quoteItems: Json[] = [];
  let subtotal = BigInt(0);
  let unpricedCount = 0;

  for (const item of items) {
    const product = productsBySlug.get(item.slug);
    if (!product) {
      return {
        error: message(
          "Uno de los ecógrafos seleccionados ya no está disponible. Actualiza la página.",
          "A selected ultrasound system is no longer available. Refresh the page.",
        ),
      };
    }
    const unitPrice =
      typeof product.price === "number" &&
      Number.isSafeInteger(product.price) &&
      product.price >= 0
        ? BigInt(product.price)
        : null;
    const lineTotal = unitPrice === null ? null : unitPrice * BigInt(item.quantity);
    if (lineTotal === null) {
      unpricedCount += 1;
    } else {
      subtotal += lineTotal;
    }
    quoteItems.push({
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      category: product.category,
      quantity: item.quantity,
      unit_price: unitPrice?.toString() ?? null,
      line_total: lineTotal?.toString() ?? null,
    });
  }

  if (subtotal > MAX_AMOUNT) {
    return {
      error: message(
        "El monto de la cotización supera el máximo permitido. Reduce las cantidades.",
        "The quote exceeds the maximum amount. Reduce the quantities.",
      ),
    };
  }
  const discountAmount =
    (subtotal * BigInt(discountBasisPoints) + BigInt(5000)) / BigInt(10000);
  const discountedSubtotal = subtotal - discountAmount;
  const tax = (discountedSubtotal * BigInt(19) + BigInt(50)) / BigInt(100);
  const total = discountedSubtotal + tax;
  if (total > MAX_AMOUNT) {
    return {
      error: message(
        "El monto de la cotización supera el máximo permitido. Reduce las cantidades.",
        "The quote exceeds the maximum amount. Reduce the quantities.",
      ),
    };
  }

  const { error: saveError } = await supabase.from("quote_requests").upsert(
    {
      request_token: requestToken,
      customer_name: name,
      customer_email: normalizedEmail,
      customer_phone: phone,
      quote_items: quoteItems,
      subtotal: Number(subtotal),
      discount_percent: discountBasisPoints / 100,
      discount_amount: Number(discountAmount),
      tax_amount: Number(tax),
      total: Number(total),
      unpriced_items: unpricedCount,
      contact_verified: false,
    },
    { onConflict: "request_token" },
  );

  if (saveError) {
    console.error("Could not save quote selection", { code: saveError.code });
    return {
      error: message(
        "No se pudo guardar la cotización. Inténtalo nuevamente.",
        "The quote could not be saved. Please try again.",
      ),
    };
  }

  return {
    success: true,
    requestToken,
    message: message(
      "Cotización guardada. Correo y teléfono validados por formato, sin confirmar titularidad.",
      "Quote saved. Email and phone format checked; ownership not confirmed.",
    ),
  };
}
