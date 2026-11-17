import "server-only";

import { redirect } from "next/navigation";
import { isAllowedPanelEmail } from "./authorization";
import { createServerComponentClient } from "./server";

export async function requirePanelAdmin() {
  const supabase = await createServerComponentClient();
  const { data, error } = await supabase.auth.getClaims();
  const claims = error ? null : data?.claims;

  if (!claims?.sub || !isAllowedPanelEmail(claims.email)) {
    redirect("/panel/login");
  }

  return claims;
}
