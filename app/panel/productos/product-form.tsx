"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import type { Product } from "@/app/data/products";
import { saveProductAction } from "./actions";
import { productToFormValues } from "./fields";
import { ImageUploadControl } from "./image-upload-control";
import type { ProductActionState } from "./types";

const initialState: ProductActionState = {};

const fieldClassName =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500";

export function ProductForm({ product }: { product?: Product }) {
  const [state, formAction, isPending] = useActionState(
    saveProductAction,
    initialState,
  );
  const values = product ? productToFormValues(product) : null;
  const [image, setImage] = useState(values?.image ?? "");
  const [gallery, setGallery] = useState(values?.gallery ?? "");
  const [pendingUploads, setPendingUploads] = useState(0);

  return (
    <form action={formAction} className="space-y-7">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      <section>
        <h2 className="text-lg font-black text-slate-900">Identificación del equipo</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-slate-700">
            Nombre del modelo
            <input required name="name" defaultValue={values?.name} maxLength={160} className={fieldClassName} />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Slug de la ficha
            <input required name="slug" defaultValue={values?.slug} maxLength={120} pattern="[a-z0-9]+(-[a-z0-9]+)*" className={fieldClassName} />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Marca
            <input required name="brand" defaultValue={values?.brand} maxLength={80} placeholder="Samsung, Chison..." className={fieldClassName} />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Categoría / especialidad
            <input required name="category" defaultValue={values?.category} maxLength={100} placeholder="Portátiles, Cardiología..." className={fieldClassName} />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Tipo de equipo
            <input required name="type" defaultValue={values?.type} maxLength={160} className={fieldClassName} />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Disponibilidad
            <input required name="availability" defaultValue={values?.availability} maxLength={80} placeholder="En stock, Disponible..." className={fieldClassName} />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Precio (CLP, opcional)
            <input
              type="number"
              name="price"
              min="0"
              step="1"
              inputMode="numeric"
              defaultValue={values?.price ?? ""}
              placeholder="Vacío = consultar precio"
              className={fieldClassName}
            />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Tecnología
            <input required name="technology" defaultValue={values?.technology} maxLength={160} className={fieldClassName} />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Doppler
            <input required name="doppler" defaultValue={values?.doppler} maxLength={160} className={fieldClassName} />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Cantidad de transductores
            <input required type="number" name="transducers" min="0" max="100" step="1" defaultValue={values?.transducers ?? 0} className={fieldClassName} />
          </label>
          <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
            Imagen principal (URL o archivo)
            <input required type="url" name="image" value={image} onChange={(event) => setImage(event.currentTarget.value)} maxLength={2048} className={fieldClassName} />
            <ImageUploadControl
              target="main"
              onUploaded={(urls) => setImage(urls[0])}
              onBusyChange={(busy) => setPendingUploads((count) => count + (busy ? 1 : -1))}
            />
          </label>
          <label className="block text-sm font-semibold text-slate-700 sm:col-span-2">
            Galería (una URL por línea o sube varios archivos)
            <textarea
              name="gallery"
              value={gallery}
              onChange={(event) => setGallery(event.currentTarget.value)}
              placeholder="https://..."
              rows={3}
              className={`${fieldClassName} resize-y`}
            />
            <ImageUploadControl
              target="gallery"
              onUploaded={(urls) =>
                setGallery((current) =>
                  [current.trim(), ...urls].filter(Boolean).join("\n"),
                )
              }
              onBusyChange={(busy) => setPendingUploads((count) => count + (busy ? 1 : -1))}
            />
          </label>
          <TextAreaField
            label="Descripción"
            name="description"
            required
            defaultValue={values?.description}
            className="sm:col-span-2"
          />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-black text-slate-900">Detalles y aplicaciones</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-slate-700">
            Promoción (opcional)
            <input name="promo" defaultValue={values?.promo} maxLength={240} className={fieldClassName} />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Financiamiento (opcional)
            <input name="financing" defaultValue={values?.financing} maxLength={500} className={fieldClassName} />
          </label>
          <TextAreaField
            label="Aplicaciones (una por línea)"
            name="applications"
            defaultValue={values?.applications}
            placeholder={"Ginecología\nMedicina general"}
          />
          <TextAreaField
            label="Accesorios (uno por línea)"
            name="accessories"
            defaultValue={values?.accessories}
            placeholder={"Transductor convexo\nCable de instalación"}
          />
          <TextAreaField
            label="Ficha técnica (una fila «Dato | Valor» por línea)"
            name="specs"
            defaultValue={values?.specs}
            className="sm:col-span-2"
            placeholder={"Pantalla | 19 pulgadas\nModo | 4D"}
          />
          <TextAreaField
            label="Garantía"
            name="warranty"
            required
            defaultValue={values?.warranty}
          />
          <TextAreaField
            label="Servicio"
            name="service"
            required
            defaultValue={values?.service}
          />
        </div>
      </section>

      {state.error ? (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.error}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
        <button
          type="submit"
          disabled={isPending || pendingUploads > 0}
          className="luxury-button rounded-full px-6 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pendingUploads > 0
            ? "Subiendo imágenes…"
            : isPending
              ? "Guardando…"
              : product
                ? "Guardar cambios"
                : "Agregar ecógrafo"}
        </button>
        <Link
          href="/panel/productos"
          className="rounded-full border border-slate-200 px-6 py-3 text-sm font-bold text-slate-700 hover:border-blue-300 hover:text-blue-800"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}

function TextAreaField({
  label,
  name,
  defaultValue,
  required = false,
  className = "",
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  className?: string;
  placeholder?: string;
}) {
  return (
    <label className={`block text-sm font-semibold text-slate-700 ${className}`}>
      {label}
      <textarea
        name={name}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        rows={3}
        className={`${fieldClassName} resize-y`}
      />
    </label>
  );
}
