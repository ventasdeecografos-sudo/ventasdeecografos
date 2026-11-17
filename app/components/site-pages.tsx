"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import type { Product } from "../data/products";
import { useLocale } from "./site-shell";
import { QuoteCalculator } from "./quote-calculator";

const imageMedical = "/medical-diagnostics.jpg";
const imageClinic = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=85";

function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(96,165,250,0.16),transparent_24%),linear-gradient(135deg,#ffffff_0%,#f8fafc_55%,#eff6ff_100%)] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-700">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight tracking-[-0.055em] sm:text-5xl lg:text-6xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">{description}</p>
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-700">{children}</p>;
}

function ContactLink({ children }: { children: ReactNode }) {
  return (
    <Link href="/contacto" className="luxury-button rounded-full px-5 py-3 text-sm font-bold text-white">
      {children}
    </Link>
  );
}

export function HomePage({ products }: { products: Product[] }) {
  const language = useLocale();
  const es = language === "es";
  const featuredProducts = products.slice(0, 3);
  const highlights = es
    ? [
        ["Asesoría especializada", "Recomendaciones alineadas con tu especialidad y flujo clínico."],
        ["Acompañamiento completo", "Apoyo en la selección, instalación y puesta en marcha."],
        ["Soporte cercano", "Atención comercial y técnica desde Santiago para todo Chile."],
      ]
    : [
        ["Expert guidance", "Recommendations tailored to your specialty and clinical workflow."],
        ["End-to-end support", "Help with selection, installation and setup."],
        ["Local service", "Sales and technical support from Santiago across Chile."],
      ];

  return (
    <main>
      <QuoteCalculator products={products} />

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(96,165,250,0.16),transparent_20%),linear-gradient(135deg,#ffffff_0%,#f8fafc_52%,#eff6ff_100%)] text-slate-900">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-blue-800">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              {es ? "Venta de ecógrafos en Chile" : "Ultrasound systems for sale in Chile"}
            </span>
            <h2 className="mt-6 max-w-2xl text-4xl font-black leading-[1.06] tracking-[-0.06em] sm:text-5xl lg:text-6xl">
              {es ? "Encuentra el ecógrafo ideal para tu práctica." : "Find the right ultrasound system for your practice."}
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              {es
                ? "Compra ecógrafos portátiles y estacionarios de marcas reconocidas, con cotización personalizada, instalación y soporte en todo Chile."
                : "Buy portable and cart-based ultrasound systems from established brands, with tailored quotes, installation and support across Chile."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/servicios" className="luxury-button rounded-full px-6 py-3 text-sm font-black text-white">
                {es ? "Ver ecógrafos" : "Shop ultrasound systems"}
              </Link>
              <Link href="/contacto" className="rounded-full border border-blue-200 bg-white px-6 py-3 text-sm font-bold text-blue-800 hover:border-blue-300 hover:bg-blue-50">
                {es ? "Solicitar cotización" : "Request a quote"}
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold text-slate-600">
              <span>Samsung</span><span>Chison</span><span>LG</span>
              <span className="text-blue-700">{es ? "Cotización personalizada" : "Tailored quotes"}</span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-5 rounded-[2.5rem] bg-blue-400/10 blur-2xl" />
            <div className="relative rounded-[2rem] border border-white bg-white/80 p-3 shadow-[0_35px_90px_rgba(15,23,42,0.16)] backdrop-blur">
              <Image src={imageMedical} alt={es ? "Profesionales médicos en una sala de procedimientos" : "Medical professionals in a procedure room"} width={1400} height={900} unoptimized className="h-[340px] w-full rounded-[1.5rem] object-cover sm:h-[440px]" />
              <div className="absolute bottom-7 left-7 right-7 rounded-2xl border border-white/80 bg-white/95 p-5 shadow-lg backdrop-blur-md">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-700">{es ? "Soluciones para cada especialidad" : "Solutions for every specialty"}</p>
                <p className="mt-2 text-xl font-black text-slate-900">{es ? "Una decisión informada empieza con una buena asesoría." : "An informed decision starts with expert advice."}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="ecografos-destacados" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Eyebrow>{es ? "Catálogo de equipos" : "Ultrasound catalog"}</Eyebrow>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              {es ? "Ecógrafos destacados" : "Featured ultrasound systems"}
            </h2>
            <p className="mt-3 max-w-2xl text-slate-600">
              {es
                ? "Compara equipos para distintas especialidades y solicita una propuesta según tu configuración."
                : "Compare systems for different specialties and request a quote for your configuration."}
            </p>
          </div>
          <Link href="/servicios" className="text-sm font-bold text-blue-700 hover:text-blue-900">
            {es ? "Ver catálogo completo →" : "View full catalog →"}
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <article key={product.id} className="overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
              <Image
                src={product.image}
                alt={product.name}
                width={900}
                height={700}
                unoptimized
                className="h-56 w-full object-cover"
              />
              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800">{product.brand}</span>
                  <span className="text-xs font-semibold text-slate-500">
                    {es
                      ? product.availability
                      : product.availability === "En stock"
                        ? "In stock"
                        : product.availability === "Disponible"
                          ? "Available"
                          : "Special order"}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-black text-slate-900">{product.name}</h3>
                <p className="mt-1 text-sm font-medium text-slate-600">{translateCategory(product.category, !es)}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {productCopy(product.slug, !es) ?? product.description}
                </p>
                <p className="mt-4 text-sm font-bold text-blue-800">
                  {es ? "Precio: cotización personalizada" : "Pricing: tailored quotation"}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link href={`/product/${product.slug}`} className="luxury-button rounded-full px-4 py-2.5 text-xs font-bold text-white">
                    {es ? "Ver equipo" : "View system"}
                  </Link>
                  <Link href="/contacto" className="rounded-full border border-slate-300 px-4 py-2.5 text-xs font-bold text-slate-700 hover:border-blue-500 hover:text-blue-800">
                    {es ? "Cotizar" : "Request a quote"}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-5 md:grid-cols-3">
          {highlights.map(([title, description], index) => (
            <article key={title} className="rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-blue-100 text-sm font-black text-blue-800">0{index + 1}</span>
              <h2 className="mt-5 text-xl font-black text-slate-900">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Eyebrow>{es ? "Qué hacemos" : "What we do"}</Eyebrow>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">{es ? "Tecnología para una atención mejor" : "Technology for better care"}</h2>
            </div>
            <Link href="/servicios" className="text-sm font-bold text-blue-700 hover:text-blue-900">{es ? "Ver todos los servicios →" : "View all services →"}</Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {(es
              ? [["Ecógrafos", "Portátiles y estacionarios para diagnóstico general y especialidades."], ["Asesoría de compra", "Selección de equipo, transductores y configuración según tus necesidades."], ["Instalación y soporte", "Acompañamiento para que tu equipo esté listo para el trabajo clínico."]]
              : [["Ultrasound systems", "Portable and cart-based systems for general and specialty imaging."], ["Purchase guidance", "Equipment, transducer and configuration selection for your needs."], ["Installation & support", "Guidance to get your equipment ready for clinical use."]]
            ).map(([title, description]) => (
              <article key={title} className="rounded-[1.6rem] border border-slate-200 bg-slate-50 p-6">
                <div className="text-2xl text-blue-700">✳</div>
                <h3 className="mt-4 text-xl font-black text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
        <Image src={imageClinic} alt={es ? "Profesionales de la salud en un entorno clínico" : "Healthcare professionals in a clinical setting"} width={1400} height={900} unoptimized className="h-[340px] w-full rounded-[2rem] object-cover shadow-[0_24px_60px_rgba(15,23,42,0.12)]" />
        <div>
          <Eyebrow>{es ? "Una relación de confianza" : "Built on trust"}</Eyebrow>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">{es ? "No solo eliges un equipo. Eliges quién te acompaña." : "You choose more than equipment. You choose who supports you."}</h2>
          <p className="mt-5 leading-7 text-slate-600">
            {es
              ? "En ventasdeecografos conectamos tecnología de diagnóstico con asesoría humana. Te ayudamos a comparar opciones y a planificar cada paso, desde la cotización hasta la puesta en marcha."
              : "At ventasdeecografos, we connect diagnostic technology with thoughtful guidance. We help you compare options and plan each step, from quotation to setup."}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/sobre-nosotros" className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 hover:border-blue-500 hover:text-blue-800">{es ? "Conoce ventasdeecografos" : "Meet ventasdeecografos"}</Link>
            <ContactLink>{es ? "Solicitar asesoría" : "Request advice"}</ContactLink>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-50 via-slate-50 to-white px-4 py-16 text-slate-900 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <Eyebrow>{es ? "Hablemos de tu próximo equipo" : "Let's talk about your next system"}</Eyebrow>
            <h2 className="mt-2 text-3xl font-black">{es ? "Encuentra la solución adecuada para tu práctica." : "Find the right solution for your practice."}</h2>
          </div>
          <ContactLink>{es ? "Contactar a ventasdeecografos" : "Contact ventasdeecografos"}</ContactLink>
        </div>
      </section>
    </main>
  );
}

export function AboutPage() {
  const es = useLocale() === "es";
  const values = es
    ? [["Cercanía", "Escuchamos a cada profesional y entendemos las necesidades de su entorno clínico."], ["Criterio técnico", "Explicamos las diferencias entre equipos para facilitar decisiones informadas."], ["Compromiso", "Acompañamos al cliente antes y después de la compra."]]
    : [["Partnership", "We listen to healthcare professionals and understand their clinical needs."], ["Technical insight", "We explain equipment differences to support informed decisions."], ["Commitment", "We support our clients before and after purchase."]];
  return (
    <main>
      <PageHero eyebrow={es ? "Sobre ventasdeecografos" : "About ventasdeecografos"} title={es ? "Tecnología médica con acompañamiento experto." : "Medical technology, backed by expert support."} description={es ? "Acercamos soluciones de ultrasonido a clínicas, hospitales y profesionales de la salud en Chile, con una atención clara, cercana y especializada." : "We bring ultrasound solutions to clinics, hospitals and healthcare professionals in Chile through clear, personal and specialized service."} />
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-20">
        <div>
          <Eyebrow>{es ? "Nuestra historia" : "Our story"}</Eyebrow>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">{es ? "Nacimos para hacer más simple una decisión importante." : "We make an important decision simpler."}</h2>
          <p className="mt-5 leading-7 text-slate-600">{es ? "La elección de un ecógrafo impacta el diagnóstico, el flujo de atención y la inversión de cada centro médico. ventasdeecografos reúne tecnología de marcas reconocidas con orientación personalizada para que cada institución pueda evaluar sus alternativas con confianza." : "Choosing an ultrasound system affects diagnosis, patient flow and a clinic's investment. ventasdeecografos brings established brands together with tailored guidance so every organization can assess its options with confidence."}</p>
          <p className="mt-4 leading-7 text-slate-600">{es ? "Trabajamos con soluciones Samsung, Chison y LG, y damos apoyo durante el proceso de evaluación, compra y puesta en marcha." : "We work with Samsung, Chison and LG solutions, supporting customers throughout evaluation, purchase and setup."}</p>
        </div>
        <Image src={imageMedical} alt={es ? "Profesionales médicos en una sala de procedimientos" : "Medical professionals in a procedure room"} width={1400} height={900} unoptimized className="h-[360px] w-full rounded-[2rem] object-cover shadow-xl" />
      </section>
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl"><Eyebrow>{es ? "Propósito y valores" : "Purpose and values"}</Eyebrow><h2 className="mt-3 text-3xl font-black text-slate-900">{es ? "Una misión clara, una relación duradera." : "A clear mission, a lasting relationship."}</h2><p className="mt-4 leading-7 text-slate-600">{es ? "Nuestra misión es facilitar el acceso a tecnología de ultrasonido confiable con información transparente y soporte durante todo el ciclo de compra." : "Our mission is to make reliable ultrasound technology accessible through transparent information and support throughout the purchasing journey."}</p></div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">{values.map(([title, description]) => <article key={title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6"><h3 className="text-xl font-black text-slate-900">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{description}</p></article>)}</div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-blue-100 bg-blue-50 p-8 text-slate-900 sm:p-10">
          <Eyebrow>{es ? "Nuestra experiencia" : "Our experience"}</Eyebrow>
          <div className="mt-4 grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div><h2 className="text-3xl font-black">{es ? "Asesoría, tecnología y servicio en un solo equipo." : "Guidance, technology and service in one team."}</h2><p className="mt-4 max-w-2xl leading-7 text-slate-600">{es ? "Conocemos las distintas necesidades de la imagenología clínica y te ayudamos a revisar categorías, aplicaciones, transductores, disponibilidad y soporte." : "We understand the range of clinical imaging needs and help you review categories, applications, transducers, availability and support."}</p></div>
            <ContactLink>{es ? "Conversemos" : "Let's talk"}</ContactLink>
          </div>
        </div>
      </section>
    </main>
  );
}

function productCopy(slug: string, english: boolean) {
  if (!english) return undefined;
  const descriptions: Record<string, string> = {
    "samsung-hera-w10": "A premium solution for clinics and hospitals that need speed, diagnostic detail and a refined user experience.",
    "chison-q9": "Portable, robust performance for practices, outpatient care and mobile diagnostic services.",
    "lg-epiq-7": "Designed for cardiovascular studies with high definition and advanced cardiac analysis.",
    "lg-sonosite-sii": "A compact point-of-care system for fast assessment in clinical and emergency settings.",
    "samsung-ugeo-h60": "A versatile imaging platform for general practice and a wide range of clinical applications.",
    "chison-eco-8": "A dependable portable system that balances mobility, image quality and ease of use.",
  };
  return descriptions[slug] ?? "Explore a clinical ultrasound system configured for your practice.";
}

function translateCategory(category: string, english: boolean) {
  if (!english) return category;
  const translations: Record<string, string> = {
    Portátiles: "Portable", Estacionarios: "Cart-based", Ginecología: "Gynecology", Obstetricia: "Obstetrics",
    Cardiología: "Cardiology", "Músculo-esquelético": "Musculoskeletal", "Medicina general": "General medicine",
    Reacondicionados: "Refurbished",
  };
  return translations[category] ?? category;
}

function translateApplication(application: string, english: boolean) {
  if (!english) return application;
  const translations: Record<string, string> = {
    Ginecología: "Gynecology", Obstetricia: "Obstetrics", Abdomen: "Abdomen", Cardiología: "Cardiology",
    Pediatría: "Pediatrics", Urgencias: "Emergency care", Vascular: "Vascular", Fertilidad: "Fertility",
    Tiroides: "Thyroid", "Músculo-esquelético": "Musculoskeletal", "Atención primaria": "Primary care",
  };
  return translations[application] ?? application;
}

export function ServicesPage({ products }: { products: Product[] }) {
  const es = useLocale() === "es";
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("Todas");
  const [category, setCategory] = useState("Todas");
  const [promoOnly, setPromoOnly] = useState(false);
  const [sortBy, setSortBy] = useState("destacados");
  const filtered = useMemo(() => [...products]
    .filter((product) => {
      const matchesBrand = brand === "Todas" || product.brand === brand;
      const matchesCategory = category === "Todas" || product.category === category;
      const matchesPromo = !promoOnly || Boolean(product.promo);
      const normalized = query.trim().toLowerCase();
      const matchesQuery = !normalized || [product.name, product.description, product.brand, product.category, ...product.applications].some((value) => value.toLowerCase().includes(normalized));
      return matchesBrand && matchesCategory && matchesPromo && matchesQuery;
    })
    .sort((a, b) => {
      if (sortBy === "marca") return a.brand.localeCompare(b.brand);
      if (sortBy === "categoria") return a.category.localeCompare(b.category);
      if (sortBy === "disponibilidad") {
        const order: Record<string, number> = { "En stock": 3, Disponible: 2, "Pedido especial": 1 };
        return (order[b.availability] ?? 0) - (order[a.availability] ?? 0);
      }
      return 0;
    }), [brand, category, products, promoOnly, query, sortBy]);
  const brandFilters = ["Todas", ...new Set(products.map((product) => product.brand))];
  const categoryFilters = [...new Set(products.map((product) => product.category))];
  return (
    <main>
      <PageHero eyebrow={es ? "Ecógrafos" : "Ultrasound"} title={es ? "Ecógrafos para distintas prácticas clínicas." : "Ultrasound systems for every clinical practice."} description={es ? "Compara modelos, aplicaciones y disponibilidad. Cada propuesta se cotiza según la configuración y las necesidades de tu centro." : "Compare models, applications and availability. Every proposal is quoted according to your configuration and clinic's needs."}>
        <Link href="/contacto" className="luxury-button rounded-full px-6 py-3 text-sm font-bold text-white">{es ? "Solicitar una cotización" : "Request a quote"}</Link>
      </PageHero>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_auto_auto] md:items-center">
          <label className="block text-xs font-bold text-slate-600">
            {es ? "Buscar equipos" : "Search systems"}
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={es ? "Modelo, marca o especialidad" : "Model, brand or specialty"} className="mt-2 w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 md:w-[360px]" />
          </label>
          <label className="block text-xs font-bold text-slate-600">
            {es ? "Ordenar por" : "Sort by"}
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="mt-2 w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500">
              <option value="destacados">{es ? "Destacados" : "Featured"}</option>
              <option value="marca">{es ? "Marca" : "Brand"}</option>
              <option value="categoria">{es ? "Categoría" : "Category"}</option>
              <option value="disponibilidad">{es ? "Disponibilidad" : "Availability"}</option>
            </select>
          </label>
          <p className="text-sm text-slate-500">{es ? `${filtered.length} equipos disponibles para explorar` : `${filtered.length} systems to explore`}</p>
        </div>
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap gap-2" aria-label={es ? "Filtrar por marca" : "Filter by brand"}>{brandFilters.map((item) => <button key={item} type="button" onClick={() => setBrand(item)} className={`rounded-full px-4 py-2 text-sm font-bold ${brand === item ? "bg-slate-950 text-white" : "border border-slate-200 bg-white text-slate-700 hover:border-blue-500"}`}>{item === "Todas" && es ? "Todas las marcas" : item === "Todas" ? "All brands" : item}</button>)}</div>
          <div className="flex flex-wrap gap-2" aria-label={es ? "Filtrar por categoría" : "Filter by category"}>{["Todas", ...categoryFilters].map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`rounded-full px-3.5 py-2 text-xs font-bold ${category === item ? "bg-blue-100 text-blue-900" : "border border-slate-200 bg-white text-slate-600 hover:border-blue-400"}`}>{item === "Todas" ? (es ? "Todas las especialidades" : "All specialties") : translateCategory(item, !es)}</button>)}</div>
          <label className="inline-flex min-h-11 items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={promoOnly} onChange={(event) => setPromoOnly(event.target.checked)} className="h-4 w-4 rounded border-slate-300 accent-blue-600" />
            {es ? "Mostrar solo promociones vigentes" : "Show current promotions only"}
          </label>
        </div>
        {filtered.length ? <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {filtered.map((product) => <article key={product.id} className="overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
            <div className="grid sm:grid-cols-[0.9fr_1.1fr]">
              <Image src={product.image} alt={product.name} width={900} height={700} unoptimized className="h-56 w-full object-cover sm:h-full" />
              <div className="p-6">
                <div className="flex items-center justify-between gap-3"><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800">{product.brand}</span><span className="text-xs font-semibold text-slate-500">{es ? product.availability : product.availability === "En stock" ? "In stock" : product.availability === "Disponible" ? "Available" : product.availability === "Consultar disponibilidad" ? "Check availability" : "Special order"}</span></div>
                <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-900">{product.name}</h2>
                {product.promo ? <p className="mt-1 text-xs font-bold text-blue-700">{es ? product.promo : product.promo === "Financiamiento disponible" ? "Financing available" : "Installation + transducer offer"}</p> : null}
                <p className="mt-2 text-sm leading-6 text-slate-600">{productCopy(product.slug, !es) ?? product.description}</p>
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">{translateCategory(product.category, !es)}</p>
                <div className="mt-4 flex flex-wrap gap-2">{product.applications.slice(0, 3).map((application) => <span key={application} className="rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-600">{translateApplication(application, !es)}</span>)}</div>
                <p className="mt-5 text-sm font-bold text-blue-800">{es ? "Precio: cotización personalizada" : "Pricing: tailored quotation"}</p>
                <div className="mt-5 flex flex-wrap gap-2"><Link href={`/product/${product.slug}`} className="luxury-button rounded-full px-4 py-2.5 text-xs font-bold text-white">{es ? "Ver producto" : "View product"}</Link><Link href="/contacto" className="rounded-full border border-slate-300 px-4 py-2.5 text-xs font-bold text-slate-700 hover:border-blue-500 hover:text-blue-800">{es ? "Consultar" : "Enquire"}</Link></div>
              </div>
            </div>
          </article>)}
        </div> : <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-600">{es ? "No encontramos equipos con esos filtros. Prueba otra búsqueda o consúltanos." : "No systems match these filters. Try another search or contact us."}</div>}
      </section>
      <section className="bg-slate-950 py-16 text-white"><div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-3 lg:px-8">{(es ? [["01", "Asesoría clínica", "Revisamos especialidad, volumen de estudio y flujo de atención."], ["02", "Propuesta a medida", "Cotizamos equipo, transductores y accesorios según tu caso."], ["03", "Puesta en marcha", "Coordinamos instalación, capacitación y soporte." ]]: [["01", "Clinical guidance", "We review your specialty, exam volume and workflow."], ["02", "Tailored proposal", "We quote equipment, transducers and accessories for your needs."], ["03", "Getting started", "We coordinate installation, training and support."]]).map(([number, title, text]) => <article key={number} className="border-l border-blue-400/50 pl-5"><p className="text-sm font-black text-blue-300">{number}</p><h2 className="mt-3 text-xl font-black">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-400">{text}</p></article>)}</div></section>
    </main>
  );
}

export function PortfolioPage() {
  const es = useLocale() === "es";
  const cases = es
    ? [
        ["01", "Diagnóstico general", "Configuración versátil para atención ambulatoria, abdomen y estudios de rutina.", "Medicina general · Consulta"],
        ["02", "Salud de la mujer", "Tecnología de imagen para apoyar los flujos de ginecología y obstetricia.", "Ginecología · Obstetricia"],
        ["03", "Evaluación cardiovascular", "Opciones de imagen y Doppler para prácticas con foco cardiológico.", "Cardiología · Vascular"],
      ]
    : [
        ["01", "General imaging", "Versatile configuration for outpatient care, abdominal exams and routine studies.", "General medicine · Practice"],
        ["02", "Women's health", "Imaging technology to support gynecology and obstetrics workflows.", "Gynecology · Obstetrics"],
        ["03", "Cardiovascular assessment", "Imaging and Doppler options for cardiology-focused practices.", "Cardiology · Vascular"],
      ];
  return (
    <main>
      <PageHero eyebrow={es ? "Portafolio" : "Portfolio"} title={es ? "Soluciones pensadas para la práctica real." : "Solutions designed for real-world practice."} description={es ? "Una muestra de cómo distintas configuraciones de ultrasonido pueden responder a necesidades clínicas. Los ejemplos son referenciales y se personalizan para cada centro." : "Examples of how different ultrasound configurations can meet clinical needs. These are illustrative and can be tailored to each organization."} />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-8 max-w-2xl"><Eyebrow>{es ? "Áreas de aplicación" : "Applications"}</Eyebrow><h2 className="mt-3 text-3xl font-black text-slate-900">{es ? "Ejemplos de proyectos y flujos clínicos" : "Project and clinical workflow examples"}</h2><p className="mt-3 leading-7 text-slate-600">{es ? "Cada caso ilustra un punto de partida para conversar sobre tecnología, configuración y soporte; no representa un proyecto atribuido a un cliente." : "Each example is a starting point for discussing technology, configuration and support; none is attributed to a specific client."}</p></div>
        <div className="grid gap-6 lg:grid-cols-3">
          {cases.map(([number, title, description, tag], index) => (
            <article key={number} className="group overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
              <div className="relative">
                <Image
                  src={[imageMedical, imageClinic, "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=85"][index]}
                  alt={title}
                  width={1200}
                  height={800}
                  unoptimized
                  className="h-60 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-blue-800">{number}</span>
              </div>
              <div className="p-6">
                <p className="text-[10px] font-black uppercase tracking-[0.17em] text-blue-700">{tag}</p>
                <h3 className="mt-3 text-2xl font-black text-slate-900">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
                <Link href="/contacto" className="mt-5 inline-flex text-sm font-bold text-blue-800 hover:text-blue-950">{es ? "Conversemos sobre tu proyecto →" : "Let's discuss your project →"}</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="bg-blue-50 py-14"><div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8"><div><Eyebrow>{es ? "Tu próximo proyecto" : "Your next project"}</Eyebrow><h2 className="mt-2 text-2xl font-black text-slate-900">{es ? "Cuéntanos qué necesita tu centro." : "Tell us what your clinic needs."}</h2></div><ContactLink>{es ? "Solicitar asesoría" : "Request guidance"}</ContactLink></div></section>
    </main>
  );
}

export function BlogPage() {
  const es = useLocale() === "es";
  const articles = es
    ? [
        ["Guía de compra", "Cómo elegir un ecógrafo según la especialidad clínica", "Identifica los criterios que conviene evaluar antes de cotizar: aplicaciones, transductores, movilidad y soporte.", "8 min de lectura"],
        ["Tecnología", "Doppler en ultrasonido: conceptos para una decisión informada", "Una introducción a las modalidades Doppler y a las preguntas que puedes plantear al comparar equipos.", "6 min de lectura"],
        ["Gestión clínica", "Qué considerar al planificar la instalación de un ecógrafo", "Espacio, conectividad, capacitación y servicio: una lista de preparación para tu centro.", "5 min de lectura"],
      ]
    : [
        ["Buying guide", "How to choose an ultrasound system for your specialty", "Key criteria to consider before requesting a quote: applications, transducers, mobility and support.", "8 min read"],
        ["Technology", "Ultrasound Doppler: concepts for an informed decision", "An introduction to Doppler modes and questions to ask when comparing systems.", "6 min read"],
        ["Clinical operations", "Planning the installation of an ultrasound system", "Space, connectivity, training and service: a preparation checklist for your practice.", "5 min read"],
      ];
  return (
    <main>
      <PageHero eyebrow={es ? "Blog y novedades" : "Blog & news"} title={es ? "Ideas para decidir con más información." : "Insights to help you make informed decisions."} description={es ? "Consejos, guías y novedades sobre tecnología de ultrasonido y equipamiento para el diagnóstico clínico." : "Tips, guides and news about ultrasound technology and clinical diagnostic equipment."} />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-8"><Eyebrow>{es ? "Artículos destacados" : "Featured articles"}</Eyebrow><h2 className="mt-3 text-3xl font-black text-slate-900">{es ? "Novedades de ventasdeecografos" : "ventasdeecografos updates"}</h2></div>
        <div className="grid gap-6 lg:grid-cols-3">
          {articles.map(([category, title, summary, readTime], index) => (
            <article id={`nota-${index + 1}`} key={title} className="flex flex-col overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
              <Image
                src={[imageMedical, imageClinic, "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=85"][index]}
                alt=""
                width={1200}
                height={800}
                unoptimized
                className="h-52 w-full object-cover"
              />
              <div className="flex flex-1 flex-col p-6">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-700">{category}</p>
                <h3 className="mt-3 text-xl font-black leading-snug text-slate-900">{title}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{summary}</p>
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
                  <span>{readTime}</span>
                  <a href={`/blog#nota-${index + 1}`} className="font-bold text-blue-800">{es ? "Leer artículo →" : "Read article →"}</a>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-600">{es ? "Publicamos nuevos contenidos periódicamente. Si tienes una pregunta técnica, nuestro equipo puede orientarte." : "We publish new content regularly. If you have a technical question, our team can help."}</div>
      </section>
    </main>
  );
}

export function ContactPage() {
  const es = useLocale() === "es";
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.alert(es
      ? "Solicitud enviada correctamente. Un asesor se comunicará con usted a la brevedad."
      : "Your request has been sent. An advisor will be in touch shortly.");
  };
  return (
    <main>
      <PageHero eyebrow={es ? "Contacto" : "Contact"} title={es ? "Conversemos sobre lo que necesitas." : "Let's talk about what you need."} description={es ? "Cuéntanos sobre tu centro, especialidad o proyecto. Un asesor te ayudará a revisar las alternativas y próximos pasos." : "Tell us about your practice, specialty or project. An advisor will help you review your options and next steps."} />
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-20">
        <div>
          <Eyebrow>{es ? "Estamos para ayudarte" : "We're here to help"}</Eyebrow>
          <h2 className="mt-3 text-3xl font-black text-slate-900">{es ? "Atención cercana, donde estés." : "Personal service, wherever you are."}</h2>
          <p className="mt-4 leading-7 text-slate-600">{es ? "Atendemos desde Santiago y coordinamos asesoría para centros de todo Chile." : "We are based in Santiago and coordinate guidance for clinics throughout Chile."}</p>
          <div className="mt-8 space-y-5">
            <a href="mailto:ventas@ultrasis.cl" className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 hover:border-blue-300"><span className="text-xl">✉</span><span><span className="block text-xs font-bold uppercase tracking-wider text-slate-500">{es ? "Correo electrónico" : "Email"}</span><span className="mt-1 block font-bold text-slate-900">ventas@ultrasis.cl</span></span></a>
            <a href="tel:+56912345678" className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 hover:border-blue-300"><span className="text-xl">☎</span><span><span className="block text-xs font-bold uppercase tracking-wider text-slate-500">{es ? "Teléfono" : "Phone"}</span><span className="mt-1 block font-bold text-slate-900">+56 9 1234 5678</span></span></a>
            <a href="https://wa.me/56912345678" target="_blank" rel="noreferrer" className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 hover:border-blue-300"><span className="text-xl">◉</span><span><span className="block text-xs font-bold uppercase tracking-wider text-slate-500">WhatsApp</span><span className="mt-1 block font-bold text-slate-900">{es ? "Escríbenos" : "Message us"}</span></span></a>
            <div className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4"><span className="text-xl">⌖</span><span><span className="block text-xs font-bold uppercase tracking-wider text-slate-500">{es ? "Ubicación" : "Location"}</span><span className="mt-1 block font-bold text-slate-900">{es ? "Santiago, Chile · Atención nacional" : "Santiago, Chile · Nationwide service"}</span></span></div>
            <div className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4"><span className="text-xl">◷</span><span><span className="block text-xs font-bold uppercase tracking-wider text-slate-500">{es ? "Horario de atención" : "Business hours"}</span><span className="mt-1 block font-bold text-slate-900">{es ? "Coordina el horario con nuestro equipo." : "Schedule a time with our team."}</span></span></div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_65px_rgba(15,23,42,0.08)] sm:p-8">
          <h2 className="text-2xl font-black text-slate-900">{es ? "Envíanos un mensaje" : "Send us a message"}</h2>
          <p className="mt-2 text-sm text-slate-600">{es ? "Completa el formulario y un asesor se pondrá en contacto contigo." : "Fill out the form and an advisor will contact you."}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">{es ? "Nombre completo" : "Full name"}<input required type="text" name="name" autoComplete="name" className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none focus:border-blue-500" /></label>
            <label className="text-sm font-semibold text-slate-700">{es ? "Clínica o institución" : "Clinic or organization"}<input type="text" name="organization" autoComplete="organization" className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none focus:border-blue-500" /></label>
            <label className="text-sm font-semibold text-slate-700">{es ? "Correo electrónico" : "Email address"}<input required type="email" name="email" autoComplete="email" className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none focus:border-blue-500" /></label>
            <label className="text-sm font-semibold text-slate-700">{es ? "Teléfono" : "Phone"}<input required type="tel" name="phone" autoComplete="tel" className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none focus:border-blue-500" /></label>
            <label className="text-sm font-semibold text-slate-700 sm:col-span-2">{es ? "País y ciudad" : "Country and city"}<input type="text" name="location" autoComplete="address-level2" className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none focus:border-blue-500" /></label>
            <label className="text-sm font-semibold text-slate-700 sm:col-span-2">{es ? "¿Qué solución te interesa?" : "What solution are you interested in?"}<select name="interest" className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none focus:border-blue-500"><option>{es ? "Ecógrafo / equipo" : "Ultrasound system"}</option><option>{es ? "Asesoría de compra" : "Purchase guidance"}</option><option>{es ? "Instalación o soporte" : "Installation or support"}</option><option>{es ? "Otro" : "Other"}</option></select></label>
            <label className="text-sm font-semibold text-slate-700">{es ? "Presupuesto estimado" : "Estimated budget"}<input type="text" name="budget" placeholder={es ? "Ej.: $20.000.000 CLP" : "e.g. CLP 20,000,000"} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none focus:border-blue-500" /></label>
            <label className="text-sm font-semibold text-slate-700">{es ? "Medio de contacto preferido" : "Preferred contact method"}<select name="preferredContact" className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none focus:border-blue-500"><option>WhatsApp</option><option>{es ? "Correo electrónico" : "Email"}</option><option>{es ? "Llamada telefónica" : "Phone call"}</option></select></label>
            <label className="text-sm font-semibold text-slate-700 sm:col-span-2">{es ? "Mensaje" : "Message"}<textarea required name="message" rows={4} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none focus:border-blue-500" /></label>
          </div>
          <label className="mt-5 flex min-h-11 items-start gap-3 text-xs leading-5 text-slate-600"><input required type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300 accent-blue-600" />{es ? "Autorizo que ventasdeecografos me contacte para responder esta solicitud." : "I agree to be contacted by ventasdeecografos regarding this request."}</label>
          <button type="submit" className="luxury-button mt-6 w-full rounded-full px-5 py-3.5 text-sm font-black text-white">{es ? "Enviar solicitud" : "Send request"}</button>
        </form>
      </section>
    </main>
  );
}
