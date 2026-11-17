import Link from "next/link";
import { signOutAction } from "./actions";

export function PanelHeader({
  active,
  email,
}: {
  active: "quotes" | "products";
  email: string;
}) {
  const linkClass = (isActive: boolean) =>
    `rounded-full px-4 py-2 text-sm font-bold transition ${
      isActive
        ? "bg-blue-800 text-white"
        : "text-slate-600 hover:bg-blue-50 hover:text-blue-800"
    }`;

  return (
    <header>
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">
            Administración
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Sesión iniciada como{" "}
            <span className="font-semibold text-slate-900">{email}</span>
          </p>
        </div>
        <form action={signOutAction}>
          <button
            type="submit"
            className="rounded-full border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:border-blue-300 hover:text-blue-800"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
      <nav
        aria-label="Secciones del panel"
        className="mt-6 flex flex-wrap gap-2 rounded-full bg-slate-100 p-1"
      >
        <Link
          href="/panel"
          aria-current={active === "quotes" ? "page" : undefined}
          className={linkClass(active === "quotes")}
        >
          Clientes potenciales
        </Link>
        <Link
          href="/panel/productos"
          aria-current={active === "products" ? "page" : undefined}
          className={linkClass(active === "products")}
        >
          Catálogo completo
        </Link>
      </nav>
    </header>
  );
}
