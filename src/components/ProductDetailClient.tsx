"use client";

import Link from "next/link";
import { useEffect } from "react";
import type { Product } from "@/lib/data";
import { copy, formatPrice } from "@/lib/i18n";
import { absoluteUrl, getSiteUrl } from "@/lib/site";
import { useLanguagePreference } from "@/lib/use-language";
import { ProductArtwork } from "./ProductArtwork";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Icon } from "./icons";

export function ProductDetailClient({ product, store }: { product: Product; store: { name: string; phoneDisplay: string; phoneHref: string } }) {
  const [language, changeLanguage] = useLanguagePreference();
  const t = copy[language];

  useEffect(() => {
    document.documentElement.lang = language === "tk" ? "tk" : language;
  }, [language]);

  const stockClass = product.stock === 0 ? "sold" : product.stock <= 3 ? "low" : "ok";
  const stockText = product.stock === 0 ? t.soldOut : product.stock <= 3 ? t.lowStock : t.inStock;
  const siteUrl = getSiteUrl();
  const productUrl = `${siteUrl}/urunler/${product.slug}`;
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    inLanguage: "tk",
    name: product.name.tk,
    description: product.description.tk,
    image: product.image ? [absoluteUrl(product.image)].filter((value): value is string => Boolean(value)) : undefined,
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: product.currency,
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: store.name },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026"),
        }}
      />
      <div className="site-shell detail-shell">
        <header className="topbar">
        <Link href="/" className="brand" aria-label={store.name}><span className="brand-mark"><Icon name="store" size={18} /></span><span>{store.name}</span></Link>
        <div className="top-actions"><LanguageSwitcher language={language} onChange={changeLanguage} ariaLabel={language === "tk" ? "Dil" : language === "ru" ? "Язык" : "Language"} /><a className="icon-button" href={store.phoneHref} aria-label={t.call}><Icon name="phone" size={19} /></a></div>
        </header>

        <main className="detail-main">
        <Link href="/" className="back-link"><Icon name="chevron" size={16} className="rotate-180" />{t.back}</Link>
        <div className="detail-layout">
          <div className="detail-visual"><ProductArtwork product={product} large language={language} /></div>
          <article className="detail-copy">
            <span className="section-kicker">{t.product}</span>
            <h1>{product.name[language] || product.name.tk}</h1>
            <div className="detail-price">{formatPrice(product.price, product.currency, language)}</div>
            <div className={`detail-stock ${stockClass}`}><i /> {stockText} {product.stock > 0 ? `· ${product.stock} ${t.stock.toLocaleLowerCase()}` : ""}</div>
            <div className="detail-rule" />
            <h2>{t.description}</h2>
            <p>{product.description[language] || product.description.tk}</p>
            <a className="primary-button detail-call" href={store.phoneHref}><Icon name="phone" size={18} />{t.call}: {store.phoneDisplay}</a>
          </article>
        </div>
        </main>
        <footer className="footer"><div><span className="brand-mark"><Icon name="store" size={16} /></span><strong>{store.name}</strong></div><a href={store.phoneHref} aria-label={`${t.call}: ${store.phoneDisplay}`}><Icon name="phone" size={16} /> {store.phoneDisplay}</a></footer>
      </div>
    </>
  );
}
