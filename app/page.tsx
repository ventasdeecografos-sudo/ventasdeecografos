import { connection } from "next/server";
import { HomePage } from "./components/site-pages";
import { getProducts } from "@/lib/products";

export const instant = false;

export default async function Home() {
  await connection();
  const products = await getProducts();
  return <HomePage products={products} />;
}
