import type { Product } from "./data";
import { products as localProducts, store as localStore } from "./data";
import { getSupabase } from "./supabase";
import { isSafePublicImageUrl, normalizePhoneHref } from "./site";

export type CatalogStore = typeof localStore;

const categories = new Set<Product["category"]>(["phones", "accessories", "audio", "watches", "charging", "laptops"]);
const accents = new Set<Product["accent"]>(["blue", "ice", "sky", "navy", "silver", "mint"]);
const icons = new Set<Product["icon"]>(["phone", "headphones", "watch", "charger", "laptop", "case"]);

function localized(value: unknown, fallback = "") {
  const source = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const tk = typeof source.tk === "string" && source.tk.trim() ? source.tk : fallback;
  const ru = typeof source.ru === "string" && source.ru.trim() ? source.ru : tk;
  const en = typeof source.en === "string" && source.en.trim() ? source.en : tk;
  return { tk, ru, en } as const;
}

function finiteNumber(value: unknown, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function mapProduct(row: Record<string, unknown>): Product {
  const categoryValue = String(row.category ?? "phones");
  const accentValue = String(row.accent ?? "blue");
  const iconValue = String(row.icon ?? "phone");
  const image = typeof row.image === "string" && isSafePublicImageUrl(row.image) ? row.image : undefined;
  const price = Math.max(0, Math.min(finiteNumber(row.price, 0), 999999999999.99));
  const stock = Math.max(0, Math.min(Math.floor(finiteNumber(row.stock, 0)), 2147483647));

  return {
    id: String(row.id),
    slug: String(row.slug),
    name: localized(row.name, String(row.slug)),
    description: localized(row.description),
    category: categories.has(categoryValue as Product["category"]) ? categoryValue as Product["category"] : "phones",
    price,
    currency: /^[A-Z]{3,5}$/.test(String(row.currency ?? "TMT")) ? String(row.currency) : "TMT",
    stock,
    image,
    accent: accents.has(accentValue as Product["accent"]) ? accentValue as Product["accent"] : "blue",
    icon: icons.has(iconValue as Product["icon"]) ? iconValue as Product["icon"] : "phone",
    featured: Boolean(row.featured),
  };
}

export async function getStore(): Promise<CatalogStore> {
  const client = getSupabase();
  if (!client) return localStore;

  const { data, error } = await client
    .from("store_settings")
    .select("name, phone_display, phone_href, location")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    console.error("Store settings query failed.", error);
    throw error;
  }
  if (!data) throw new Error("Store settings are not configured.");

  const name = data.name?.trim() ?? "";
  const phoneDisplay = data.phone_display?.trim() ?? "";
  const phoneHref = normalizePhoneHref(phoneDisplay);
  const location = data.location?.trim() ?? "";
  if (!name || !phoneDisplay || !phoneHref || !location) {
    throw new Error("Store settings are invalid.");
  }

  return {
    name,
    phoneDisplay,
    phoneHref,
    location,
  };
}

export async function getCatalog() {
  const client = getSupabase();
  if (!client) return { products: localProducts, store: localStore, source: "local" as const };

  const [{ data: productRows, error: productError }, remoteStore] = await Promise.all([
    client
      .from("products")
      .select("id, slug, name, description, category, price, currency, stock, image, accent, icon, featured, sort_order")
      .eq("active", true)
      .order("featured", { ascending: false })
      .order("sort_order", { ascending: true })
      .order("name->>tk", { ascending: true }),
    getStore(),
  ]);

  if (productError) {
    console.error("Catalog query failed.", productError);
    throw productError;
  }

  return {
    products: (productRows ?? []).map((row) => mapProduct(row as Record<string, unknown>)),
    store: remoteStore,
    source: "supabase" as const,
  };
}

export async function getProductBySlug(slug: string) {
  const client = getSupabase();
  if (!client) return localProducts.find((product) => product.slug === slug);

  const { data, error } = await client
    .from("products")
    .select("id, slug, name, description, category, price, currency, stock, image, accent, icon, featured")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (error) {
    console.error("Product query failed.", error);
    throw error;
  }
  if (!data) return undefined;
  return mapProduct(data as Record<string, unknown>);
}
