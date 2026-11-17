"use client";

import { useActionState } from "react";
import { signInAction, type LoginState } from "./actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    signInAction,
    initialState,
  );

  return (
    <form action={formAction} className="mt-7 space-y-5">
      <label className="block text-sm font-semibold text-slate-700">
        Correo electrónico
        <input
          required
          type="email"
          name="email"
          autoComplete="username"
          maxLength={320}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
        />
      </label>
      <label className="block text-sm font-semibold text-slate-700">
        Contraseña
        <input
          required
          type="password"
          name="password"
          autoComplete="current-password"
          maxLength={256}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
        />
      </label>
      {state.error ? (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isPending}
        className="luxury-button w-full rounded-full px-5 py-3.5 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Ingresando…" : "Ingresar al panel"}
      </button>
    </form>
  );
}
