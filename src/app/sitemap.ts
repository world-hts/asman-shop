import type { MetadataRoute } from "next";
import { getCatalog } from "@/lib/catalog";
import { getSiteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const catalog = await getCatalog();
  const productUrls = catalog.products.map((product) => ({
    url: `${base}/urunler/${product.slug}`,
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  return [
    { url: `${base}/`, changeFrequency: "daily", priority: 1 },
    ...productUrls,
  ];
}
