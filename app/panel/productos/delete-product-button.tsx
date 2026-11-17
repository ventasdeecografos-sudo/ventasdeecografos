"use client";

import { useActionState } from "react";
import { deleteProductAction } from "./actions";
import type { ProductActionState } from "./types";

const initialState: ProductActionState = {};

export function DeleteProductButton({
  id,
  name,
}: {
  id: number;
  name: string;
}) {
  const [state, formAction, isPending] = useActionState(
    deleteProductAction,
    initialState,
  );

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!window.confirm(`¿Eliminar ${name}? Esta acción no se puede deshacer.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      {state.error ? (
        <p role="alert" className="mb-2 max-w-48 text-xs text-red-700">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isPending}
        className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-bold text-red-700 hover:border-red-400 hover:bg-red-50 disabled:opacity-60"
      >
        {isPending ? "Eliminando…" : "Eliminar"}
      </button>
    </form>
  );
}
