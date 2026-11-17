import type { Product } from "@/app/data/products";

type ProductRow = Product & {
  promo: string | null;
  financing: string | null;
};

type ProductInsert = Omit<ProductRow, "id"> & { id?: number };

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type QuoteRequestRow = {
  id: number;
  request_token: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  quote_items: Json;
  subtotal: number;
  discount_percent: number;
  discount_amount: number;
  tax_amount: number;
  total: number;
  unpriced_items: number;
  contact_verified: boolean;
  created_at: string;
};

type QuoteRequestInsert = Omit<QuoteRequestRow, "id" | "created_at"> & {
  id?: number;
  created_at?: string;
};

export type Database = {
  public: {
    Tables: {
      products: {
        Row: ProductRow;
        Insert: ProductInsert;
        Update: Partial<ProductInsert>;
        Relationships: [];
      };
      quote_requests: {
        Row: QuoteRequestRow;
        Insert: QuoteRequestInsert;
        Update: Partial<QuoteRequestInsert>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
