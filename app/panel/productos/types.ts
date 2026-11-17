export type ProductActionState = {
  error?: string;
  success?: boolean;
};

export type ProductImageUploadTarget = "main" | "gallery";

export type ProductImageUpload = {
  path: string;
  token: string;
  publicUrl: string;
};

export type ProductImageUploadState =
  | { uploads: ProductImageUpload[] }
  | { error: string };
