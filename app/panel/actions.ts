"use server";

import { redirect } from "next/navigation";
import { createServerActionClient } from "@/lib/supabase/server";

export async function signOutAction() {
  const supabase = await createServerActionClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Supabase panel sign-out failed", {
      code: error.code,
      status: error.status,
    });
    throw new Error("Could not end the panel session.");
  }

  redirect("/panel/login");
}
