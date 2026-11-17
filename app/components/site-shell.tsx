"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";

type Language = "es" | "en";
const LANGUAGE_STORAGE_KEY = "ultrasis-language";
const LANGUAGE_CHANGED_EVENT = "ultrasis-language-change";

const LanguageContext = createContext<{
  language: Language;
  setLanguage: (language: Language) => void;
} | null>(null);

const navigation = {
  es: [
    { label: "Inicio", href: "/" },
    { label: "Sobre nosotros", href: "/sobre-nosotros" },
    { label: "Ecógrafos", href: "/servicios" },
    { label: "Portafolio", href: "/portafolio" },
    { label: "Blog", href: "/blog" },
    { label: "Contacto", href: "/contacto" },
  ],
  en: [
    { label: "Home", href: "/" },
    { label: "About us", href: "/sobre-nosotros" },
    { label: "Ultrasound", href: "/servicios" },
    { label: "Portfolio", href: "/portafolio" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contacto" },
  ],
};

function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}

function getLanguageSnapshot(): Language {
  return window.localStorage.getItem(LANGUAGE_STORAGE_KEY) === "en" ? "en" : "es";
}

function getServerLanguageSnapshot(): Language {
  return "es";
}

function subscribeToLanguage(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(LANGUAGE_CHANGED_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(LANGUAGE_CHANGED_EVENT, onChange);
  };
}

function updateLanguage(language: Language) {
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  window.dispatchEvent(new Event(LANGUAGE_CHANGED_EVENT));
}

export function useLocale() {
  return useLanguage().language;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const language = useSyncExternalStore(
    subscribeToLanguage,
    getLanguageSnapshot,
    getServerLanguageSnapshot,
  );

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: updateLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <label className="flex items-center">
      <span className="sr-only">{language === "es" ? "Seleccionar idioma" : "Choose language"}</span>
      <select
        aria-label={language === "es" ? "Seleccionar idioma" : "Choose language"}
        value={language}
        onChange={(event) => setLanguage(event.target.value as Language)}
        className="min-h-11 cursor-pointer rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none transition hover:border-blue-500 focus:border-blue-500"
      >
        <option value="es">ES</option>
        <option value="en">EN</option>
      </select>
    </label>
  );
}

export function SiteHeader() {
  const { language } = useLanguage();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const items = navigation[language];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 shadow-[0_8px_30px_rgba(15,23,42,0.05)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="ventasdeecografos, inicio">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-sky-700 text-xl font-black text-white shadow-[0_12px_24px_rgba(14,116,144,0.25)]">
            V
          </span>
          <span>
            <span className="block text-xs font-black uppercase tracking-[0.1em] text-blue-700 sm:text-sm">ventasdeecografos</span>
            <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">
              {language === "es" ? "Tecnología médica" : "Medical technology"}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex" aria-label={language === "es" ? "Navegación principal" : "Main navigation"}>
          {items.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`min-h-11 rounded-full px-3 py-2 text-sm font-semibold transition ${
                  active ? "bg-blue-50 text-blue-800" : "text-slate-600 hover:bg-slate-50 hover:text-blue-700"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/panel"
            className="min-h-11 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-bold text-slate-700 transition hover:border-blue-500 hover:text-blue-700"
          >
            Panel
          </Link>
          <LanguageSelector />
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-label={menuOpen
              ? language === "es" ? "Cerrar menú" : "Close menu"
              : language === "es" ? "Abrir menú" : "Open menu"}
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-xl text-slate-700 xl:hidden"
          >
            {menuOpen ? "×" : "☰"}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav className="border-t border-slate-100 bg-white px-4 py-3 shadow-lg xl:hidden" aria-label={language === "es" ? "Navegación principal" : "Main navigation"}>
          <div className="mx-auto grid max-w-7xl gap-1 sm:grid-cols-2">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={(item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)) ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
                className="min-h-11 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-800"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}

export function SiteFooter() {
  const { language } = useLanguage();
  const items = navigation[language];

  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr] lg:px-8">
        <div>
          <Link href="/" className="text-sm font-black uppercase tracking-[0.12em] text-white">ventasdeecografos</Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
            {language === "es"
              ? "Tecnología de ultrasonido, asesoría especializada y acompañamiento para profesionales de la salud."
              : "Ultrasound technology, expert guidance and support for healthcare professionals."}
          </p>
        </div>
        <div>
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-blue-300">
            {language === "es" ? "Explora" : "Explore"}
          </h2>
          <nav className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm" aria-label={language === "es" ? "Enlaces del pie" : "Footer links"}>
            {items.map((item) => (
              <Link key={item.href} href={item.href} className="inline-flex min-h-11 items-center hover:text-white">{item.label}</Link>
            ))}
          </nav>
        </div>
        <div>
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-blue-300">
            {language === "es" ? "Hablemos" : "Get in touch"}
          </h2>
          <div className="mt-4 space-y-3 text-sm">
            <a href="mailto:ventas@ultrasis.cl" className="block hover:text-white">ventas@ultrasis.cl</a>
            <a href="tel:+56912345678" className="block hover:text-white">+56 9 1234 5678</a>
            <a href="https://wa.me/56912345678" target="_blank" rel="noreferrer" className="block hover:text-white">WhatsApp</a>
            <p className="text-slate-400">{language === "es" ? "Santiago, Chile · Atención nacional" : "Santiago, Chile · Nationwide service"}</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>© ventasdeecografos. {language === "es" ? "Todos los derechos reservados." : "All rights reserved."}</p>
          <p>{language === "es" ? "Soluciones de diagnóstico por imágenes" : "Diagnostic imaging solutions"}</p>
        </div>
      </div>
    </footer>
  );
}
