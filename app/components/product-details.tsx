"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "../data/products";
import { useLocale } from "./site-shell";

const translations: Record<string, string> = {
  "Aplicaciones clínicas": "Clinical applications",
  "Accesorios incluidos": "Included accessories",
  "Ficha técnica": "Technical specifications",
  "Disponibilidad": "Availability",
  "Consultar disponibilidad": "Check availability",
  "Garantía": "Warranty",
  "Consultar condiciones": "Confirm conditions",
  "Servicio técnico": "Technical service",
  "Consultar cobertura de servicio técnico.": "Ask about technical service coverage.",
  "Consultar ficha técnica": "Request the technical specifications",
  "Consultar configuración": "Confirm the configuration",
  "Por confirmar": "To be confirmed",
  "Financiamiento": "Financing",
  "Ecógrafo diagnóstico general": "General diagnostic ultrasound system",
  "Ecógrafo portátil": "Portable ultrasound system",
  "Ecógrafo portátil veterinario": "Portable veterinary ultrasound system",
  "Ecógrafo estacionario": "Cart-based ultrasound system",
  "Ecógrafo reacondicionado": "Refurbished ultrasound system",
  "Ecógrafo cardiológico": "Cardiac ultrasound system",
  "Ecógrafo de alta resolución": "High-resolution ultrasound system",
  "Ecógrafo generalista": "General-purpose ultrasound system",
  "Ecógrafo de punto de atención": "Point-of-care ultrasound system",
  "Promoción por instalación + transductores": "Installation + transducer offer",
  "Financiamiento disponible": "Financing available",
  "Doppler color": "Color Doppler",
  "Cardio avanzado": "Advanced cardiac imaging",
  "Doppler pulsado y continuo": "Pulsed and continuous Doppler",
  "Doppler multifrecuencia": "Multi-frequency Doppler",
  "2D/3D/4D cardíaco": "2D/3D/4D cardiac imaging",
  "4D con navegación": "4D navigation",
  "5 incluídos": "5 included",
  "5 incluidos": "5 included",
  "4 especializados": "4 specialized",
  "Función de cuantificación avanzada": "Advanced quantification",
  "Análisis fetal y ginecológico": "Fetal and gynecological analysis",
  "Rutinario y ambulatorio": "Routine and outpatient care",
  "Punto de atención y urgencias": "Point-of-care and emergency use",
  "Transductor convexo": "Convex transducer",
  "Transductor lineal": "Linear transducer",
  "Base de soporte": "Support stand",
  "Cableado de instalación": "Installation cabling",
  "Batería extra": "Extra battery",
  "Carro de transporte": "Transport cart",
  "Transductores adicionales": "Additional transducers",
  "Estuche protector": "Protective case",
  "Transductor cardiaco": "Cardiac transducer",
  "Monitor portátil": "Portable monitor",
  "Protector de pantalla": "Screen protector",
  "Kit de conexión": "Connection kit",
  "Transductor transvaginal": "Transvaginal transducer",
  "Kit obstétrico": "Obstetric kit",
  "Soporte de monitor": "Monitor stand",
  "Cableado de red": "Network cabling",
  "Transductor de abdomen": "Abdominal transducer",
  "Transductor vascular": "Vascular transducer",
  "Soporte móvil": "Mobile stand",
  "Mantenimiento básico": "Basic maintenance",
  "Batería adicional": "Additional battery",
  "Maletín transporte": "Transport case",
  "Transductor pediátrico": "Pediatric transducer",
  "Cargador de viaje": "Travel charger",
  "3 incluidos": "3 included",
  "4 incluidos": "4 included",
  "6 incluidos": "6 included",
  "2 incluidos": "2 included",
  "2 años de garantía oficial en equipo y servicio técnico.": "Two-year official warranty on equipment and technical service.",
  "1 año de garantía y servicio técnico local.": "One-year warranty with local technical service.",
  "2 años con soporte técnico y actualización de software.": "Two years of technical support and software updates.",
  "2 años de garantía con servicio especializado.": "Two-year warranty with specialized service.",
  "1 año de garantía institucional.": "One-year institutional warranty.",
  "1 año de garantía y cobertura técnica.": "One-year warranty and technical coverage.",
  "Capacitación inicial, instalación y soporte posterior disponible.": "Initial training, installation and ongoing support available.",
  "Soporte técnico y mantenimiento preventivo con respuesta rápida.": "Technical support and preventive maintenance with prompt response.",
  "Servicio de calibración y soporte para departamentos cardiovasculares.": "Calibration service and support for cardiovascular departments.",
  "Instalación, capacitación y soporte en departamento de obstetricia.": "Installation, training and support for obstetrics departments.",
  "Asistencia técnica y soporte para consultorios y centros ambulatorios.": "Technical assistance and support for practices and outpatient centers.",
  "Servicio activo en urgencias y atención médica de primera línea.": "Active service for emergency and frontline care.",
  "Financiamiento con cuotas preferenciales para clínicas y centros de diagnóstico.": "Preferential financing plans for clinics and diagnostic centers.",
  "Plan de financiamiento para equipos cardiológicos y de alta complejidad.": "Financing plans for cardiac and advanced systems.",
  "Productos similares": "Similar products",
  "También puede interesarte": "You may also be interested in",
  "Volver al catálogo": "Back to services",
  "Ver detalle": "View details",
  "Solicitar cotización": "Request a quote",
  "En stock": "In stock",
  "Disponible": "Available",
  "Pedido especial": "Special order",
  "Medicina general": "General medicine",
  "Veterinaria": "Veterinary medicine",
  "Músculo-esquelético": "Musculoskeletal",
  "Estacionarios": "Cart-based",
  "Portátiles": "Portable",
  "Ginecología": "Gynecology",
  "Obstetricia": "Obstetrics",
  "Cardiología": "Cardiology",
  "Pediatría": "Pediatrics",
  "Fertilidad": "Fertility",
  "Atención primaria": "Primary care",
  "Urgencias": "Emergency care",
  "Tiroides": "Thyroid",
  "Vascular": "Vascular",
  "Pantalla": "Display",
  "Resolución": "Resolution",
  "Transductores": "Transducers",
  "Software": "Software",
  "Modalidad": "Modality",
  "Análisis": "Analysis",
  "Peso": "Weight",
  "Batería": "Battery",
  "Autonomía prolongada": "Extended battery life",
  "Sistema avanzado de análisis": "Advanced analysis system",
  "21.5 pulgadas": "21.5 inches",
  "17 pulgadas": "17 inches",
  "19 pulgadas": "19 inches",
  "15 pulgadas": "15 inches",
  "12.1 pulgadas": "12.1 inches",
  "10.4 pulgadas": "10.4 inches",
  "Alta definición": "High definition",
  "Uso": "Use",
  "2D/3D": "2D/3D",
  "HD/4D": "HD/4D",
  "4D Premium": "Premium 4D",
};

function text(value: string, english: boolean) {
  return english ? translations[value] ?? value : value;
}

function description(slug: string, fallback: string, english: boolean) {
  if (!english) return fallback;
  if (fallback.startsWith("Imagen referencial.")) {
    return "Illustrative image. Contact us to confirm availability, specifications, configuration, accessories and photos of this model.";
  }
  if (fallback.startsWith("Modelo reacondicionado publicado")) {
    return "Refurbished model listed in our catalog. The image is illustrative. Contact us to confirm the unit's condition, availability, specifications and photos.";
  }
  const englishDescriptions: Record<string, string> = {
    "samsung-hera-w10": "A premium solution for clinics and hospitals that need speed, diagnostic detail and a refined user experience.",
    "chison-q9": "Portable, robust performance for practices, outpatient care and mobile diagnostic services.",
    "lg-epiq-7": "Designed for cardiovascular studies with high definition and advanced cardiac analysis.",
    "lg-sonosite-sii": "A compact point-of-care system for fast assessment in clinical and emergency settings.",
    "samsung-ugeo-h60": "A versatile imaging platform for general practice and a wide range of clinical applications.",
    "chison-eco-8": "A dependable portable system that balances mobility, image quality and ease of use.",
  };
  return englishDescriptions[slug] ?? fallback;
}

export function ProductDetails({
  product,
  similarProducts,
}: {
  product: Product;
  similarProducts: Product[];
}) {
  const english = useLocale() === "en";
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-blue-700">{english ? "Home" : "Inicio"}</Link>
          <span>/</span><Link href="/servicios" className="hover:text-blue-700">{product.brand}</Link>
          <span>/</span><span className="text-slate-700">{product.name}</span>
        </div>
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-4">
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-3 shadow-[0_30px_70px_rgba(15,23,42,0.12)]">
              <Image src={product.image} alt={product.name} width={1200} height={900} unoptimized className="h-[440px] w-full rounded-[1.4rem] object-cover" />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {product.gallery.map((image) => (
                <div key={image} className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
                  <Image src={image} alt={english ? `${product.name} view` : `${product.name} vista`} width={600} height={400} unoptimized className="h-28 w-full rounded-xl object-cover" />
                </div>
              ))}
            </div>
          </div>
          <div className="premium-card-strong rounded-[2rem] border border-slate-200 p-6">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">{product.brand}</span>
              {product.promo ? <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800">{text(product.promo, english)}</span> : null}
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-[-0.05em] text-slate-900 sm:text-4xl">{product.name}</h1>
            <p className="mt-3 text-lg text-slate-600">{text(product.type, english)}</p>
            <div className="mt-6 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <p><span className="font-semibold text-slate-900">{text("Disponibilidad", english)}:</span> {text(product.availability, english)}</p>
              <p><span className="font-semibold text-slate-900">{text("Garantía", english)}:</span> {text(product.warranty, english)}</p>
            </div>
            <p className="mt-6 text-base leading-7 text-slate-600">{description(product.slug, product.description, english)}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/contacto" className="luxury-button rounded-full px-5 py-3 text-sm font-semibold text-white">{text("Solicitar cotización", english)}</Link>
              <a href="https://wa.me/56912345678" target="_blank" rel="noreferrer" className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:border-blue-500 hover:text-blue-700">WhatsApp</a>
            </div>
            <div className="mt-8 space-y-3 text-sm text-slate-600">
              <p><span className="font-semibold text-slate-900">{english ? "Technology" : "Tecnología"}:</span> {text(product.technology, english)}</p>
              <p><span className="font-semibold text-slate-900">Doppler:</span> {text(product.doppler, english)}</p>
              <p><span className="font-semibold text-slate-900">{text("Transductores", english)}:</span> {product.transducers ? `${product.transducers} ${english ? "included" : "unidades"}` : text("Por confirmar", english)}</p>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900">{text("Aplicaciones clínicas", english)}</h2>
            <div className="mt-4 flex flex-wrap gap-2">{product.applications.map((application) => <span key={application} className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">{text(application, english)}</span>)}</div>
            <h3 className="mt-8 text-xl font-bold text-slate-900">{text("Accesorios incluidos", english)}</h3>
            <ul className="mt-4 space-y-3 text-slate-600">{product.accessories.map((item) => <li key={item} className="flex items-center gap-3"><span className="h-2.5 w-2.5 rounded-full bg-blue-500" />{text(item, english)}</li>)}</ul>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900">{text("Ficha técnica", english)}</h2>
            <div className="mt-6 space-y-4">{product.specs.map((spec) => <div key={spec.label} className="flex items-center justify-between gap-4 border-b border-slate-200 pb-3 text-sm"><span className="font-medium text-slate-500">{text(spec.label, english)}</span><span className="text-right font-semibold text-slate-900">{text(spec.value, english)}</span></div>)}</div>
            <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
              <p><span className="font-semibold text-slate-900">{text("Servicio técnico", english)}:</span> {text(product.service, english)}</p>
              {product.financing ? <p className="mt-3"><span className="font-semibold text-slate-900">{text("Financiamiento", english)}:</span> {text(product.financing, english)}</p> : null}
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">{text("Productos similares", english)}</p><h2 className="mt-2 text-3xl font-black text-slate-900">{text("También puede interesarte", english)}</h2></div>
          <Link href="/servicios" className="text-sm font-semibold text-blue-700 hover:text-blue-800">{text("Volver al catálogo", english)}</Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">{similarProducts.map((item) => <article key={item.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"><Image src={item.image} alt={item.name} width={900} height={600} unoptimized className="h-52 w-full object-cover" /><div className="p-5"><div className="mb-3 flex items-center justify-between gap-2"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">{item.brand}</span><span className="text-xs text-slate-500">{text(item.availability, english)}</span></div><h3 className="text-xl font-bold text-slate-900">{item.name}</h3><p className="mt-2 text-sm text-slate-600">{text(item.category, english)}</p><Link href={`/product/${item.slug}`} className="mt-5 inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">{text("Ver detalle", english)}</Link></div></article>)}</div>
      </section>
    </main>
  );
}
