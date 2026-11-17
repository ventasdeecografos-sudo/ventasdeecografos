"use server";

import { redirect } from "next/navigation";
import { isAllowedPanelEmail } from "@/lib/supabase/authorization";
import { createServerActionClient } from "@/lib/supabase/server";

export type LoginState = {
  error?: string;
};

const invalidCredentialsMessage = "El correo o la contraseña no son válidos.";

export async function signInAction(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const rawEmail = formData.get("email");
  const password = formData.get("password");

  if (
    typeof rawEmail !== "string" ||
    typeof password !== "string" ||
    rawEmail.length > 320 ||
    password.length > 256
  ) {
    return { error: invalidCredentialsMessage };
  }

  const email = rawEmail.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length === 0) {
    return { error: invalidCredentialsMessage };
  }

  const supabase = await createServerActionClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.code !== "invalid_credentials" && error.code !== "email_not_confirmed") {
      console.error("Supabase panel sign-in failed", {
        code: error.code,
        status: error.status,
      });
      return {
        error: "No se pudo completar el inicio de sesión. Inténtalo nuevamente.",
      };
    }

    return { error: invalidCredentialsMessage };
  }

  if (!isAllowedPanelEmail(data.user.email)) {
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      console.error("Supabase unauthorized panel sign-out failed", {
        code: signOutError.code,
        status: signOutError.status,
      });
      throw new Error("Could not clear the unauthorized panel session.");
    }

    return { error: "Esta cuenta no está autorizada para acceder al panel." };
  }

  redirect("/panel");
}
