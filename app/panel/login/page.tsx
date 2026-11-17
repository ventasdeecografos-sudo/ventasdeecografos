import { redirect } from "next/navigation";
import { isAllowedPanelEmail } from "@/lib/supabase/authorization";
import { createServerComponentClient } from "@/lib/supabase/server";
import { signOutAction } from "../actions";
import { LoginForm } from "./login-form";

export const instant = false;

export default async function PanelLoginPage() {
  const supabase = await createServerComponentClient();
  const { data, error } = await supabase.auth.getClaims();
  const claims = error ? null : data?.claims;

  if (claims?.sub && isAllowedPanelEmail(claims.email)) {
    redirect("/panel");
  }

  return (
    <main className="mx-auto flex min-h-[65vh] max-w-7xl items-center justify-center px-4 py-14 sm:px-6 lg:px-8">
      <section className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_24px_65px_rgba(15,23,42,0.08)] sm:p-9">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">
          Acceso privado
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
          Iniciar sesión
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Ingresa con tu cuenta autorizada para acceder al panel de ventasdeecografos.
        </p>
        {claims?.sub ? (
          <div className="mt-5 space-y-3">
            <p role="alert" className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Esta cuenta no está autorizada para acceder al panel.
            </p>
            <form action={signOutAction}>
              <button
                type="submit"
                className="text-sm font-bold text-blue-700 hover:text-blue-900"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        ) : null}
        <LoginForm />
      </section>
    </main>
  );
}
