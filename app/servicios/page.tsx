import { connection } from "next/server";
import { ServicesPage } from "../components/site-pages";
import { getProducts } from "@/lib/products";

export const instant = false;

export default async function Services() {
  await connection();
  const products = await getProducts();
  return <ServicesPage products={products} />;
}
