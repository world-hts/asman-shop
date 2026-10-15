import type { Language } from "./i18n";
import { normalizePhoneHref } from "./site";

export type Localized = Record<Language, string>;

export type Product = {
  id: string;
  slug: string;
  name: Localized;
  description: Localized;
  category: "phones" | "accessories" | "audio" | "watches" | "charging" | "laptops";
  price: number;
  currency: string;
  stock: number;
  image?: string;
  accent: "blue" | "ice" | "sky" | "navy" | "silver" | "mint";
  icon: "phone" | "headphones" | "watch" | "charger" | "laptop" | "case";
  featured?: boolean;
};

export const store = {
  name: process.env.NEXT_PUBLIC_STORE_NAME || "Asman Shop",
  phoneDisplay: process.env.NEXT_PUBLIC_STORE_PHONE || "+993 XX XX XX XX",
  phoneHref: normalizePhoneHref(process.env.NEXT_PUBLIC_STORE_PHONE || "+99300000000") || "tel:+99300000000",
  location: process.env.NEXT_PUBLIC_STORE_LOCATION || "Türkmenistan",
};

export const categories: { key: Product["category"]; icon: Product["icon"] }[] = [
  { key: "phones", icon: "phone" },
  { key: "accessories", icon: "case" },
  { key: "audio", icon: "headphones" },
  { key: "watches", icon: "watch" },
  { key: "charging", icon: "charger" },
  { key: "laptops", icon: "laptop" },
];

export const categoryLabel = (category: Product["category"], t: Record<string, string>) => {
  const map: Record<Product["category"], string> = {
    phones: t.phones,
    accessories: t.accessories,
    audio: t.audio,
    watches: t.watches,
    charging: t.charging,
    laptops: t.laptops,
  };
  return map[category];
};

export const products: Product[] = [
  {
    id: "phone-01",
    slug: "nova-x-pro",
    name: { tk: "Nova X Pro", ru: "Nova X Pro", en: "Nova X Pro" },
    description: {
      tk: "Ýokary tizlikli ekranly, gündelik ulanyş üçin döwrebap smartfon.",
      ru: "Современный смартфон с быстрым экраном для повседневных задач.",
      en: "A modern smartphone with a fast display for everyday use.",
    },
    category: "phones",
    price: 5200,
    currency: "TMT",
    stock: 12,
    accent: "blue",
    icon: "phone",
    featured: true,
  },
  {
    id: "phone-02",
    slug: "galaxy-lite",
    name: { tk: "Galaxy Lite", ru: "Galaxy Lite", en: "Galaxy Lite" },
    description: {
      tk: "Ýeňil göwrüm, düşnükli kamera we uzak wagtlyk batareýa.",
      ru: "Лёгкий корпус, понятная камера и аккумулятор на весь день.",
      en: "Lightweight design, a clear camera and all-day battery life.",
    },
    category: "phones",
    price: 2800,
    currency: "TMT",
    stock: 8,
    accent: "ice",
    icon: "phone",
    featured: true,
  },
  {
    id: "audio-01",
    slug: "airbeat-pro",
    name: { tk: "AirBeat Pro", ru: "AirBeat Pro", en: "AirBeat Pro" },
    description: {
      tk: "Arassa ses, rahat gulak gurluşy we simsiz baglanyşyk.",
      ru: "Чистый звук, удобная посадка и беспроводное подключение.",
      en: "Clean sound, a comfortable fit and wireless connectivity.",
    },
    category: "audio",
    price: 650,
    currency: "TMT",
    stock: 5,
    accent: "navy",
    icon: "headphones",
    featured: true,
  },
  {
    id: "accessory-01",
    slug: "shield-case-pro",
    name: { tk: "Shield Case Pro", ru: "Shield Case Pro", en: "Shield Case Pro" },
    description: {
      tk: "Telefonyňyzy gündelik urgy-sürtülmeden goramak üçin inçe gap.",
      ru: "Тонкий чехол для повседневной защиты смартфона.",
      en: "A slim case for everyday smartphone protection.",
    },
    category: "accessories",
    price: 220,
    currency: "TMT",
    stock: 18,
    accent: "sky",
    icon: "case",
    featured: true,
  },
  {
    id: "watch-01",
    slug: "pulse-watch",
    name: { tk: "Pulse Watch", ru: "Pulse Watch", en: "Pulse Watch" },
    description: {
      tk: "Gündelik bildirişler we amatly smartfunksiýalar bilen akylly sagat.",
      ru: "Умные часы с уведомлениями и удобными функциями на каждый день.",
      en: "A smart watch with notifications and useful everyday features.",
    },
    category: "watches",
    price: 1200,
    currency: "TMT",
    stock: 3,
    accent: "silver",
    icon: "watch",
  },
  {
    id: "charging-01",
    slug: "fast-charge-45",
    name: { tk: "Fast Charge 45W", ru: "Fast Charge 45W", en: "Fast Charge 45W" },
    description: {
      tk: "Gysga wagtda güýç bermek üçin 45W zarýad enjamy.",
      ru: "Зарядное устройство 45W для быстрой зарядки.",
      en: "A 45W charger built for fast everyday charging.",
    },
    category: "charging",
    price: 390,
    currency: "TMT",
    stock: 9,
    accent: "mint",
    icon: "charger",
  },
  {
    id: "laptop-01",
    slug: "airbook-14",
    name: { tk: "AirBook 14", ru: "AirBook 14", en: "AirBook 14" },
    description: {
      tk: "Inçe, ýeňil we iş üçin amatly 14 dýuým noutbuk.",
      ru: "Тонкий лёгкий ноутбук 14 дюймов для работы.",
      en: "A slim, lightweight 14-inch laptop for work and study.",
    },
    category: "laptops",
    price: 12900,
    currency: "TMT",
    stock: 2,
    accent: "ice",
    icon: "laptop",
  },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}
