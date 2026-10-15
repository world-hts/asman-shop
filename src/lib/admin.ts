import type { Product } from "./data";

export type AdminProductInput = {
  id?: string;
  slug: string;
  name: Product["name"];
  description: Product["description"];
  category: Product["category"];
  price: number;
  currency: string;
  stock: number;
  image: string | null;
  accent: Product["accent"];
  icon: Product["icon"];
  featured: boolean;
  active: boolean;
  sort_order: number;
};

export const categoryOptions: Product["category"][] = [
  "phones",
  "accessories",
  "audio",
  "watches",
  "charging",
  "laptops",
];

export const iconForCategory: Record<Product["category"], Product["icon"]> = {
  phones: "phone",
  accessories: "case",
  audio: "headphones",
  watches: "watch",
  charging: "charger",
  laptops: "laptop",
};

export function slugify(value: string) {
  return value
    .trim()
    .toLocaleLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}
