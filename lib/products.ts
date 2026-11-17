import "server-only";

import { createSupabasePublicClient } from "@/lib/supabase/public";
import type { Product } from "@/app/data/products";

export async function getProducts(): Promise<Product[]> {
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id");

  if (error) {
    console.error("Could not load products from Supabase", {
      code: error.code,
    });
    throw new Error("Could not load the product catalog.");
  }

  return data;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Could not load product from Supabase", {
      code: error.code,
    });
    throw new Error("Could not load the product.");
  }

  return data;
}
