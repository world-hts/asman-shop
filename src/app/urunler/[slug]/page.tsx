import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/components/ProductDetailClient";
import { getProductBySlug, getStore } from "@/lib/catalog";
import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 30;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [product, store] = await Promise.all([getProductBySlug(slug), getStore()]);
  if (!product) return { title: "Önüm tapylmady" };

  const title = `${product.name.tk} — ${store.name}`;
  return {
    title,
    description: product.description.tk || `${product.name.tk} — ${store.name}`,
    openGraph: {
      title,
      description: product.description.tk || `${product.name.tk} — ${store.name}`,
      type: "website",
      images: product.image ? [absoluteUrl(product.image)!] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, store] = await Promise.all([getProductBySlug(slug), getStore()]);
  if (!product) notFound();
  return <ProductDetailClient product={product} store={store} />;
}
