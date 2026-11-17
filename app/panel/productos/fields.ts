import type { Product } from "@/app/data/products";

type ProductFormResult =
  | { product: Omit<Product, "id"> }
  | { error: string };

type TextReadResult = { value: string } | { error: string };

function readText(
  formData: FormData,
  field: string,
  label: string,
): TextReadResult {
  const value = formData.get(field);
  if (typeof value !== "string") {
    return { error: `Completa el campo ${label}.` };
  }
  return { value: value.trim() };
}

function readList(formData: FormData, field: string) {
  const value = formData.get(field);
  if (typeof value !== "string") return null;
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function parseProductFormData(formData: FormData): ProductFormResult {
  const requiredFields = [
    ["slug", "slug"],
    ["brand", "marca"],
    ["name", "nombre"],
    ["category", "categoría"],
    ["type", "tipo de equipo"],
    ["availability", "disponibilidad"],
    ["technology", "tecnología"],
    ["doppler", "Doppler"],
    ["image", "imagen principal"],
    ["description", "descripción"],
    ["warranty", "garantía"],
    ["service", "servicio"],
  ] as const;
  const values: Record<(typeof requiredFields)[number][0], string> = {
    slug: "",
    brand: "",
    name: "",
    category: "",
    type: "",
    availability: "",
    technology: "",
    doppler: "",
    image: "",
    description: "",
    warranty: "",
    service: "",
  };

  for (const [field, label] of requiredFields) {
    const result = readText(formData, field, label);
    if ("error" in result) return result;
    if (!result.value) return { error: `Completa el campo ${label}.` };
    values[field] = result.value;
  }

  const maximumLengths: Record<keyof typeof values, number> = {
    slug: 120,
    brand: 80,
    name: 160,
    category: 100,
    type: 160,
    availability: 80,
    technology: 160,
    doppler: 160,
    image: 2048,
    description: 10000,
    warranty: 1000,
    service: 1000,
  };
  if (
    requiredFields.some(
      ([field]) => values[field].length > maximumLengths[field],
    )
  ) {
    return { error: "Uno de los campos supera la longitud máxima permitida." };
  }

  if (values.slug.length > 120 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(values.slug)) {
    return { error: "El slug debe usar minúsculas, números y guiones." };
  }
  if (!isHttpUrl(values.image)) {
    return { error: "La URL de la imagen principal debe ser HTTP o HTTPS." };
  }

  const transducersValue = formData.get("transducers");
  const transducers =
    typeof transducersValue === "string" && /^\d+$/.test(transducersValue)
      ? Number(transducersValue)
      : Number.NaN;
  if (!Number.isSafeInteger(transducers) || transducers < 0 || transducers > 100) {
    return { error: "La cantidad de transductores debe ser un número entre 0 y 100." };
  }

  const priceValue = formData.get("price");
  const rawPrice = typeof priceValue === "string" ? priceValue.trim() : null;
  const price =
    rawPrice === ""
      ? null
      : rawPrice !== null && /^\d+$/.test(rawPrice)
        ? Number(rawPrice)
        : Number.NaN;
  if (price !== null && (!Number.isSafeInteger(price) || price < 0)) {
    return { error: "El precio debe ser un monto entero en CLP o quedar vacío." };
  }

  const gallery = readList(formData, "gallery");
  const applications = readList(formData, "applications");
  const accessories = readList(formData, "accessories");
  const specsLines = readList(formData, "specs");
  if (!gallery || !applications || !accessories || !specsLines) {
    return { error: "Revisa las listas de imágenes, aplicaciones, accesorios y ficha técnica." };
  }
  if (gallery.length > 20 || applications.length > 50 || accessories.length > 50 || specsLines.length > 50) {
    return { error: "Una de las listas supera la cantidad máxima permitida." };
  }
  if (
    [...gallery, ...applications, ...accessories].some((item) => item.length > 2048) ||
    specsLines.some((line) => line.length > 700)
  ) {
    return { error: "Un elemento de las listas supera la longitud máxima permitida." };
  }
  if (gallery.some((url) => !isHttpUrl(url))) {
    return { error: "Cada imagen de la galería debe tener una URL HTTP o HTTPS." };
  }

  const specs = [];
  for (const line of specsLines) {
    const separator = line.indexOf("|");
    if (separator <= 0 || !line.slice(separator + 1).trim()) {
      return { error: "Cada ficha técnica debe tener el formato «Dato | Valor»." };
    }
    specs.push({
      label: line.slice(0, separator).trim(),
      value: line.slice(separator + 1).trim(),
    });
  }

  const promo = readText(formData, "promo", "promoción");
  const financing = readText(formData, "financing", "financiamiento");
  if ("error" in promo) return promo;
  if ("error" in financing) return financing;
  if (promo.value.length > 240 || financing.value.length > 500) {
    return { error: "La promoción o el financiamiento supera la longitud permitida." };
  }

  return {
    product: {
      ...values,
      transducers,
      price,
      gallery,
      promo: promo.value || null,
      applications,
      specs,
      accessories,
      financing: financing.value || null,
    },
  };
}

export function productToFormValues(product: Product) {
  return {
    ...product,
    gallery: product.gallery.join("\n"),
    applications: product.applications.join("\n"),
    specs: product.specs.map(({ label, value }) => `${label} | ${value}`).join("\n"),
    accessories: product.accessories.join("\n"),
    promo: product.promo ?? "",
    financing: product.financing ?? "",
  };
}
