import Link from "next/link";
import type { Product } from "@/lib/data";
import { ProductArtwork } from "./ProductArtwork";
import { type Language, type Copy } from "@/lib/i18n";
import { categoryLabel } from "@/lib/data";
import { formatPrice } from "@/lib/i18n";

export function ProductCard({ product, language, t }: { product: Product; language: Language; t: Copy }) {
  const stockClass = product.stock === 0 ? "sold" : product.stock <= 3 ? "low" : "ok";
  const stockText = product.stock === 0 ? t.soldOut : product.stock <= 3 ? t.lowStock : t.inStock;

  return (
    <Link href={`/urunler/${product.slug}`} className="product-card" aria-label={`${product.name[language]} — ${formatPrice(product.price, product.currency, language)}`}>
      <ProductArtwork product={product} language={language} />
      <div className="product-copy">
        <div className="product-category">{categoryLabel(product.category, t)}</div>
        <h3>{product.name[language] || product.name.tk}</h3>
        <strong>{formatPrice(product.price, product.currency, language)}</strong>
        <span className={`stock ${stockClass}`}><i aria-hidden="true" /> {stockText}{product.stock > 0 ? ` · ${product.stock}` : ""}</span>
      </div>
    </Link>
  );
}
