export function getSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const fallback = process.env.NODE_ENV === "production" ? "https://example.invalid" : "http://localhost:3000";
  try {
    return new URL(raw || fallback).toString().replace(/\/$/, "");
  } catch {
    return fallback;
  }
}

export function absoluteUrl(pathOrUrl?: string | null) {
  if (!pathOrUrl) return undefined;
  try {
    return new URL(pathOrUrl, `${getSiteUrl()}/`).toString();
  } catch {
    return undefined;
  }
}

export function normalizePhoneHref(phoneDisplay: string) {
  const normalized = phoneDisplay.trim().replace(/[^+\d]/g, "");
  if (!normalized) return "";
  const phone = normalized.startsWith("+") ? `+${normalized.slice(1).replace(/\+/g, "")}` : normalized.replace(/\+/g, "");
  if (!/^\+?[0-9]{6,20}$/.test(phone)) return "";
  return `tel:${phone}`;
}

export function isSafePublicImageUrl(value?: string | null) {
  if (!value) return false;
  if (value.startsWith("/products/") && !value.startsWith("//")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && (url.hostname.endsWith(".supabase.co") || url.hostname === "supabase.co");
  } catch {
    return false;
  }
}

export function getProductStoragePath(value?: string | null) {
  if (!value || !isSafePublicImageUrl(value) || value.startsWith("/")) return null;
  try {
    const url = new URL(value);
    const prefix = "/storage/v1/object/public/product-images/";
    if (!url.pathname.startsWith(prefix)) return null;
    const path = decodeURIComponent(url.pathname.slice(prefix.length));
    return path.startsWith("products/") ? path : null;
  } catch {
    return null;
  }
}
