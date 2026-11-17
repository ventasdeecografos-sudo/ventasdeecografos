import { connection } from "next/server";
import { notFound } from "next/navigation";
import { ProductDetails } from "../../components/product-details";
import { getProductBySlug, getProducts } from "@/lib/products";

export const instant = false;

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connection();
  const { slug } = await params;
  const [product, products] = await Promise.all([
    getProductBySlug(slug),
    getProducts(),
  ]);

  if (!product) notFound();

  const similarProducts = products
    .filter((item) => item.slug !== product.slug && item.brand === product.brand)
    .slice(0, 3);

  return <ProductDetails product={product} similarProducts={similarProducts} />;
}
