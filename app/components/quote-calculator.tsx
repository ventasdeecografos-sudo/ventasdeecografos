"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { Product } from "../data/products";
import { useLocale } from "./site-shell";
import { saveQuoteSelection } from "./quote-calculator-actions";
import type { QuoteRequestState } from "./quote-calculator-types";

const equipmentCategories = new Set(["Portátiles", "Estacionarios", "Reacondicionados"]);
const MAX_QUANTITY = 9999;
const IVA_RATE = BigInt(19);

function getSpecialties(product: Product) {
  if (product.applications.length) return product.applications;
  return equipmentCategories.has(product.category) ? [] : [product.category];
}

function getUnitPrice(product: Product): bigint | null {
  if (
    typeof product.price !== "number" ||
    !Number.isSafeInteger(product.price) ||
    product.price < 0
  ) {
    return null;
  }
  return BigInt(product.price);
}

function formatClp(amount: bigint, english: boolean) {
  return new Intl.NumberFormat(english ? "en-US" : "es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function QuoteCalculator({ products }: { products: Product[] }) {
  const english = useLocale() === "en";
  const [specialty, setSpecialty] = useState("");
  const [model, setModel] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [discount, setDiscount] = useState("0");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [requestToken, setRequestToken] = useState("");
  const [requestState, setRequestState] = useState<QuoteRequestState>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printDate, setPrintDate] = useState("");

  useEffect(() => {
    if (!isPrinting) return;

    document.body.classList.add("printing-quote");
    const handleAfterPrint = () => setIsPrinting(false);
    window.addEventListener("afterprint", handleAfterPrint);
    const timeout = window.setTimeout(() => window.print(), 0);

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("afterprint", handleAfterPrint);
      document.body.classList.remove("printing-quote");
    };
  }, [isPrinting]);

  const specialties = useMemo(
    () => [...new Set(products.flatMap(getSpecialties))].sort((a, b) => a.localeCompare(b)),
    [products],
  );
  const filteredProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          !specialty ||
          getSpecialties(product).includes(specialty) ||
          (!getSpecialties(product).length && specialty === "__unspecified"),
      ),
    [products, specialty],
  );
  const selectedProducts = products.filter((product) => quantities[product.slug]);
  const pricedLines = selectedProducts.flatMap((product) => {
    const unitPrice = getUnitPrice(product);
    return unitPrice === null
      ? []
      : [{ product, quantity: quantities[product.slug], amount: unitPrice * BigInt(quantities[product.slug]) }];
  });
  const subtotal = pricedLines.reduce((sum, line) => sum + line.amount, BigInt(0));
  const discountNumber = Number(discount);
  const validDiscount =
    discount.trim() !== "" &&
    Number.isFinite(discountNumber) &&
    discountNumber >= 0 &&
    discountNumber <= 100;
  const discountBasisPoints = validDiscount
    ? Math.round((discountNumber || 0) * 100)
    : 0;
  const discountAmount =
    (subtotal * BigInt(discountBasisPoints) + BigInt(5000)) / BigInt(10000);
  const discountedSubtotal = subtotal - discountAmount;
  const tax = (discountedSubtotal * IVA_RATE + BigInt(50)) / BigInt(100);
  const total = discountedSubtotal + tax;
  const unpricedCount = selectedProducts.filter((product) => getUnitPrice(product) === null).length;

  const normalizedPhone = customerPhone.replace(/[ ().-]/g, "");
  const customerDetailsValid =
    customerName.trim().length >= 2 &&
    customerName.trim().length <= 120 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim()) &&
    customerEmail.trim().length <= 254 &&
    /^\+[1-9]\d{7,14}$/.test(normalizedPhone);
  const canSelectProducts = customerDetailsValid && consent && validDiscount;

  async function persistSelection(nextQuantities: Record<string, number>) {
    if (!canSelectProducts || isSaving) return false;
    const token = requestToken || window.crypto.randomUUID();
    const items = Object.entries(nextQuantities).map(([slug, quantity]) => ({ slug, quantity }));
    setIsSaving(true);
    setRequestState({});

    try {
      const result = await saveQuoteSelection({
        requestToken: token,
        name: customerName.trim(),
        email: customerEmail.trim(),
        phone: customerPhone.trim(),
        consent,
        discount,
        items,
        language: english ? "en" : "es",
      });
      setRequestState(result);
      if (!result.success) return false;
      setRequestToken(result.requestToken ?? token);
      setQuantities(nextQuantities);
      return true;
    } catch (error) {
      console.error("Could not save quote selection", error);
      setRequestState({
        error: english
          ? "The quote could not be saved. Please try again."
          : "No se pudo guardar la cotización. Inténtalo nuevamente.",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function addModel() {
    if (!model || !canSelectProducts || isSaving) return;
    const nextQuantities = {
      ...quantities,
      [model]: Math.min((quantities[model] ?? 0) + 1, MAX_QUANTITY),
    };
    if (await persistSelection(nextQuantities)) setModel("");
  }

  function updateQuantity(slug: string, value: string) {
    const quantity = Number(value);
    if (
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > MAX_QUANTITY ||
      quantity === quantities[slug]
    ) return;
    void persistSelection({ ...quantities, [slug]: quantity });
  }

  function removeModel(slug: string) {
    const next = { ...quantities };
    delete next[slug];
    void persistSelection(next);
  }

  function saveDiscount() {
    if (selectedProducts.length) void persistSelection(quantities);
  }

  const fieldClassName =
    "mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-blue-500";

  return (
    <section id="cotizador" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-700">
          {english ? "Solutions for every specialty" : "Soluciones para cada especialidad"}
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          {english ? "Build an ultrasound quote" : "Arma tu cotización de ecógrafos"}
        </h1>
        <p className="mt-3 leading-7 text-slate-600">
          {english
            ? "Filter by specialty, choose models and quantities, and review an estimate with discount and 19% VAT."
            : "Filtra por especialidad, agrega modelos y cantidades, y revisa un estimado con descuento e IVA de 19%."}
        </p>
      </div>

      <section className="mt-8 rounded-[1.8rem] border border-slate-200 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-7">
        <h3 className="text-lg font-black text-slate-900">
          {english ? "Your contact details" : "Tus datos de contacto"}
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          {english
            ? "Enter your details before selecting equipment. We check format only; ownership is not verified."
            : "Ingresa tus datos antes de seleccionar equipos. Validamos el formato, pero no comprobamos la titularidad."}
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <label className="text-sm font-semibold text-slate-700">
            {english ? "Name" : "Nombre"}
            <input
              type="text"
              name="customerName"
              required
              minLength={2}
              maxLength={120}
              autoComplete="name"
              value={customerName}
              onChange={(event) => {
                setCustomerName(event.currentTarget.value);
                setRequestState({});
              }}
              className={fieldClassName}
            />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            {english ? "Email" : "Correo electrónico"}
            <input
              type="email"
              name="customerEmail"
              required
              maxLength={254}
              autoComplete="email"
              value={customerEmail}
              onChange={(event) => {
                setCustomerEmail(event.currentTarget.value);
                setRequestState({});
              }}
              className={fieldClassName}
            />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            {english ? "Phone (include country code)" : "Teléfono (incluye código de país)"}
            <input
              type="tel"
              name="customerPhone"
              required
              maxLength={24}
              autoComplete="tel"
              placeholder="+56912345678"
              title={english ? "Include the country code, e.g. +56912345678" : "Incluye el código de país, por ejemplo +56912345678"}
              value={customerPhone}
              onChange={(event) => {
                setCustomerPhone(event.currentTarget.value);
                setRequestState({});
              }}
              className={fieldClassName}
            />
          </label>
        </div>
        <label className="mt-5 block min-h-11 text-xs leading-5 text-slate-600">
          <input
            type="checkbox"
            name="consent"
            required
            checked={consent}
            onChange={(event) => {
              setConsent(event.currentTarget.checked);
              setRequestState({});
            }}
            className="mr-2 align-middle accent-blue-600"
          />
          {english
            ? "I agree to the use of my contact details to respond to this quote request."
            : "Acepto que usen mis datos de contacto para responder esta solicitud de cotización."}
        </label>
        {!canSelectProducts ? (
          <p role="status" className="mt-3 text-sm text-amber-800">
            {english
              ? "Complete the required fields and accept the contact consent to continue."
              : "Completa los campos obligatorios y acepta el uso de tus datos para continuar."}
          </p>
        ) : null}
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[1.8rem] border border-slate-200 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-7">
          <h3 className="text-lg font-black text-slate-900">
            {english ? "Select equipment" : "Selecciona tus equipos"}
          </h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">
              {english ? "Specialty" : "Especialidad"}
              <select
                value={specialty}
                disabled={!canSelectProducts || isSaving}
                onChange={(event) => {
                  setSpecialty(event.currentTarget.value);
                  setModel("");
                }}
                className={fieldClassName}
              >
                <option value="">{english ? "All specialties" : "Todas las especialidades"}</option>
                {specialties.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
                <option value="__unspecified">
                  {english ? "Specialty not specified" : "Sin especialidad especificada"}
                </option>
              </select>
            </label>
            <label className="text-sm font-semibold text-slate-700">
              {english ? "Ultrasound model" : "Modelo de ecógrafo"}
              <select
                value={model}
                disabled={!canSelectProducts || isSaving}
                onChange={(event) => setModel(event.currentTarget.value)}
                className={fieldClassName}
              >
                <option value="">{english ? "Choose a model" : "Elige un modelo"}</option>
                {filteredProducts.map((product) => {
                  const unitPrice = getUnitPrice(product);
                  return (
                    <option key={product.slug} value={product.slug}>
                      {product.name} · {unitPrice === null
                        ? english ? "price to confirm" : "precio por confirmar"
                        : formatClp(unitPrice, english)}
                    </option>
                  );
                })}
              </select>
            </label>
          </div>
          <button
            type="button"
            onClick={() => void addModel()}
            disabled={!model || !canSelectProducts || isSaving}
            className="luxury-button mt-5 rounded-full px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving
              ? english ? "Saving…" : "Guardando…"
              : english ? "Add to quote" : "Agregar a la cotización"}
          </button>
          {requestState.error ? (
            <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">
              {requestState.error}
            </p>
          ) : null}
          {requestState.success ? (
            <div role="status" className="mt-4 space-y-3 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
              <p>{requestState.message}</p>
              <button
                type="button"
                onClick={() => {
                  setPrintDate(new Date().toLocaleDateString(english ? "en-US" : "es-CL"));
                  setIsPrinting(true);
                }}
                disabled={isSaving || isPrinting}
                className="rounded-full bg-emerald-800 px-4 py-2 font-bold text-white hover:bg-emerald-900 disabled:opacity-60"
              >
                {english ? "Download quote as PDF" : "Descargar cotización en PDF"}
              </button>
              <p className="text-xs text-emerald-900">
                {english
                  ? "In the print window, choose “Save as PDF”."
                  : "En la ventana de impresión, elige «Guardar como PDF»."}
              </p>
            </div>
          ) : null}

          <div className="mt-7 border-t border-slate-100 pt-5">
            <h4 className="text-sm font-black text-slate-900">
              {english ? "Selected systems" : "Equipos seleccionados"}
            </h4>
            {!selectedProducts.length ? (
              <p className="mt-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                {english ? "Add one or more systems to start the estimate." : "Agrega uno o más ecógrafos para comenzar el cálculo."}
              </p>
            ) : (
              <ul className="mt-3 divide-y divide-slate-100">
                {selectedProducts.map((product) => {
                  const unitPrice = getUnitPrice(product);
                  const quantity = quantities[product.slug];
                  return (
                    <li key={product.slug} className="flex flex-wrap items-center justify-between gap-3 py-4">
                      <div className="min-w-40 flex-1">
                        <p className="font-bold text-slate-900">{product.name}</p>
                        <p className="text-xs text-slate-500">{product.brand} · {product.category}</p>
                        <p className="mt-1 text-sm text-slate-600">
                          {unitPrice === null
                            ? english ? "Price to be confirmed" : "Precio por confirmar"
                            : `${formatClp(unitPrice, english)} × ${quantity} = ${formatClp(unitPrice * BigInt(quantity), english)}`}
                        </p>
                      </div>
                      <label className="text-xs font-semibold text-slate-600">
                        {english ? "Quantity" : "Cantidad"}
                        <input
                          type="number"
                          min="1"
                          max={MAX_QUANTITY}
                          step="1"
                          value={quantity}
                          disabled={!canSelectProducts || isSaving}
                          onChange={(event) => updateQuantity(product.slug, event.currentTarget.value)}
                          className="mt-1 block w-24 rounded-lg border border-slate-200 px-2 py-2 text-sm text-slate-900"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => removeModel(product.slug)}
                        disabled={!canSelectProducts || isSaving}
                        aria-label={english ? `Remove ${product.name}` : `Quitar ${product.name}`}
                        className="rounded-full px-3 py-2 text-sm font-bold text-slate-500 hover:bg-red-50 hover:text-red-700"
                      >
                        {english ? "Remove" : "Quitar"}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <aside className="h-fit rounded-[1.8rem] border border-slate-200 bg-slate-50 p-5 sm:p-7">
          <h3 className="text-lg font-black text-slate-900">
            {english ? "Estimate summary" : "Resumen del cálculo"}
          </h3>
          <label className="mt-5 block max-w-xs text-sm font-semibold text-slate-700">
            {english ? "Discount for simulation (%)" : "Descuento referencial (%)"}
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              inputMode="decimal"
              value={discount}
              onChange={(event) => {
                setDiscount(event.currentTarget.value);
                setRequestState({});
              }}
              onBlur={saveDiscount}
              aria-invalid={!validDiscount}
              className={`${fieldClassName} ${validDiscount ? "" : "border-red-400"}`}
            />
          </label>
          {!validDiscount ? (
            <p role="alert" className="mt-2 text-xs text-red-700">
              {english ? "Enter a discount from 0 to 100%." : "Ingresa un descuento entre 0 y 100%."}
            </p>
          ) : null}
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between gap-4 text-slate-600">
              <dt>{english ? "Subtotal with listed prices" : "Subtotal con precio publicado"}</dt>
              <dd className="font-semibold text-slate-900">{formatClp(subtotal, english)}</dd>
            </div>
            <div className="flex justify-between gap-4 text-slate-600">
              <dt>{english ? "Discount" : "Descuento"}</dt>
              <dd className="font-semibold text-slate-900">−{formatClp(discountAmount, english)}</dd>
            </div>
            <div className="flex justify-between gap-4 text-slate-600">
              <dt>{english ? "Subtotal after discount" : "Subtotal con descuento"}</dt>
              <dd className="font-semibold text-slate-900">{formatClp(discountedSubtotal, english)}</dd>
            </div>
            <div className="flex justify-between gap-4 text-slate-600">
              <dt>IVA (19%)</dt>
              <dd className="font-semibold text-slate-900">{formatClp(tax, english)}</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-slate-200 pt-4 text-base font-black text-slate-900">
              <dt>{english ? "Estimated total" : "Total estimado"}</dt>
              <dd>{formatClp(total, english)}</dd>
            </div>
          </dl>
          {unpricedCount ? (
            <p role="status" className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
              {english
                ? `${unpricedCount} selected model(s) have no listed price. They are excluded from this partial estimate and require a separate quote.`
                : `${unpricedCount} modelo(s) seleccionado(s) no tienen precio publicado. No se incluyen en este cálculo parcial y requieren cotización.`}
            </p>
          ) : null}
          <p className="mt-4 text-xs leading-5 text-slate-500">
            {english
              ? "Estimate only. VAT is calculated at 19% after discount. Confirm discount eligibility, final pricing, availability and conditions with our team."
              : "Estimación referencial. El IVA se calcula al 19% después del descuento. Confirma la aplicación del descuento, precio final, disponibilidad y condiciones con nuestro equipo."}
          </p>
          {isSaving ? (
            <p role="status" className="mt-5 text-sm text-slate-600">
              {english ? "Saving the quote…" : "Guardando cotización…"}
            </p>
          ) : null}
          {requestState.error ? (
            <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">
              {requestState.error}
            </p>
          ) : null}
          {requestState.success && selectedProducts.length ? (
            <p role="status" className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
              {requestState.message}
            </p>
          ) : null}
        </aside>
      </div>
      {isPrinting && requestState.success && selectedProducts.length && typeof document !== "undefined"
        ? createPortal(
        <div className="quote-print-document">
          <header className="quote-print-header">
            <p className="quote-print-brand">ventasdeecografos</p>
            <p>{english ? "Ultrasound quotation" : "Cotización de ecógrafos"}</p>
            <p>{english ? "Date" : "Fecha"}: {printDate}</p>
          </header>
          <section className="quote-print-customer">
            <h1>{english ? "Customer details" : "Datos del cliente"}</h1>
            <p>{english ? "Name" : "Nombre"}: {customerName.trim()}</p>
            <p>{english ? "Email" : "Correo electrónico"}: {customerEmail.trim()}</p>
            <p>{english ? "Phone" : "Teléfono"}: {customerPhone.trim()}</p>
          </section>
          <section className="quote-print-items">
            <h2>{english ? "Selected equipment" : "Equipos seleccionados"}</h2>
            <table>
              <thead>
                <tr>
                  <th>{english ? "Model" : "Modelo"}</th>
                  <th>{english ? "Specialty" : "Especialidad"}</th>
                  <th>{english ? "Quantity" : "Cantidad"}</th>
                  <th>{english ? "Unit price" : "Precio unitario"}</th>
                  <th>{english ? "Subtotal" : "Subtotal"}</th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.map((product) => {
                  const unitPrice = getUnitPrice(product);
                  const quantity = quantities[product.slug];
                  return (
                    <tr key={product.slug}>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>{quantity}</td>
                      <td>{unitPrice === null ? (english ? "To be quoted" : "Por cotizar") : formatClp(unitPrice, english)}</td>
                      <td>
                        {unitPrice === null
                          ? (english ? "To be quoted" : "Por cotizar")
                          : formatClp(unitPrice * BigInt(quantity), english)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
          <section className="quote-print-totals">
            <p>{english ? "Subtotal with listed prices" : "Subtotal con precios publicados"}: <strong>{formatClp(subtotal, english)}</strong></p>
            <p>{english ? "Reference discount" : "Descuento referencial"} ({discountNumber}%): <strong>−{formatClp(discountAmount, english)}</strong></p>
            <p>{english ? "Subtotal after discount" : "Subtotal con descuento"}: <strong>{formatClp(discountedSubtotal, english)}</strong></p>
            <p>IVA (19%): <strong>{formatClp(tax, english)}</strong></p>
            <p className="quote-print-total">{english ? "Estimated total" : "Total estimado"}: <strong>{formatClp(total, english)}</strong></p>
          </section>
          <footer className="quote-print-disclaimer">
            {english
              ? "Estimate only. Items without a listed price are marked as to be quoted and are excluded from the calculated total. Confirm final pricing, discount eligibility, availability and conditions with our team."
              : "Cotización referencial. Los equipos sin precio publicado aparecen por cotizar y no se incluyen en el total calculado. Confirma precio final, aplicación del descuento, disponibilidad y condiciones con nuestro equipo."}
          </footer>
        </div>,
        document.body,
      )
        : null}
    </section>
  );
}
