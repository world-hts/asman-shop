"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "./icons";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ProductCard } from "./ProductCard";
import { categoryLabel, categories, type Product } from "@/lib/data";
import { copy } from "@/lib/i18n";
import { useLanguagePreference } from "@/lib/use-language";

type Store = { name: string; phoneDisplay: string; phoneHref: string; location: string };

export function StoreShell({ initialProducts, initialStore }: { initialProducts: Product[]; initialStore: Store }) {
  const [language, changeLanguage] = useLanguagePreference();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | (typeof categories)[number]["key"]>("all");
  const products = initialProducts;
  const store = initialStore;
  const t = copy[language];

  useEffect(() => {
    document.documentElement.lang = language === "tk" ? "tk" : language;
  }, [language]);

  const visibleProducts = useMemo(() => {
    const locale = language === "tk" ? "tk-TM" : language === "ru" ? "ru-RU" : "en-US";
    const needle = query.trim().toLocaleLowerCase(locale);
    return products.filter((product) => {
      const categoryMatch = activeCategory === "all" || product.category === activeCategory;
      if (!categoryMatch) return false;
      if (!needle) return true;
      return [product.name.tk, product.name.ru, product.name.en, product.description.tk, product.description.ru, product.description.en]
        .some((value) => value.toLocaleLowerCase().includes(needle));
    });
  }, [activeCategory, language, products, query]);

  const featured = products.filter((product) => product.featured);

  return (
    <div className="site-shell">
      <header className="topbar">
        <Link href="/" className="brand" aria-label={store.name}>
          <span className="brand-mark"><Icon name="store" size={18} /></span>
          <span>{store.name}</span>
        </Link>
        <div className="top-actions">
          <LanguageSwitcher language={language} onChange={changeLanguage} />
          <a className="icon-button" href={store.phoneHref} aria-label={t.call}><Icon name="phone" size={19} /></a>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <span className="eyebrow">{t.store} · {store.location}</span>
            <h1>{t.heroTitle}</h1>
            <p>{t.heroSubtitle}</p>
            <a className="primary-button" href="#products">{t.heroButton}<Icon name="arrow" size={17} /></a>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />
            <div className="hero-phone"><div className="hero-phone-screen"><span /></div></div>
            <div className="hero-float float-one"><span>{products.length}</span><small>{t.productsCount}</small></div>
            <div className="hero-float float-two"><Icon name="phone" size={18} /><span>{store.phoneDisplay}</span></div>
          </div>
        </section>

        <section className="search-section" aria-label={t.search}>
          <div className="search-box">
            <Icon name="search" size={19} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.searchShort} aria-label={t.search} />
            {query && <button type="button" onClick={() => setQuery("")} className="clear-button" aria-label={t.clear}>×</button>}
          </div>
        </section>

        <section className="content-section">
          <div className="section-heading">
            <div><span className="section-kicker">01</span><h2>{t.categories}</h2></div>
          </div>
          <div className="category-grid">
            <button type="button" aria-pressed={activeCategory === "all"} className={`category-chip ${activeCategory === "all" ? "active" : ""}`} onClick={() => setActiveCategory("all")}>
              <span className="category-icon"><Icon name="box" size={20} /></span><b>{t.allProducts}</b>
            </button>
            {categories.map((category) => (
              <button type="button" aria-pressed={activeCategory === category.key} key={category.key} className={`category-chip ${activeCategory === category.key ? "active" : ""}`} onClick={() => setActiveCategory(category.key)}>
                <span className="category-icon"><Icon name={category.icon} size={20} /></span><b>{categoryLabel(category.key, t)}</b>
              </button>
            ))}
          </div>
        </section>

        {!query && activeCategory === "all" && featured.length > 0 && (
          <section className="content-section">
            <div className="section-heading">
              <div><span className="section-kicker">02</span><h2>{t.featured}</h2></div>
              <a href="#products" className="text-link">{t.viewAll}<Icon name="chevron" size={16} /></a>
            </div>
            <div className="product-grid featured-grid">
              {featured.map((product) => <ProductCard key={product.id} product={product} language={language} t={t} />)}
            </div>
          </section>
        )}

        <section id="products" className="content-section products-section">
          <div className="section-heading">
            <div><span className="section-kicker">03</span><h2>{t.allProducts}</h2></div>
            <span className="result-count">{visibleProducts.length}</span>
          </div>
          {visibleProducts.length ? (
            <div className="product-grid">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} language={language} t={t} />)}</div>
          ) : (
            <div className="empty-state"><div className="empty-placeholder" aria-hidden="true"><Icon name="box" size={38} /></div><h3>{query ? t.noResults : t.noProducts}</h3><p>{query ? t.searchShort : ""}</p></div>
          )}
        </section>
      </main>

      <footer className="footer">
        <div><span className="brand-mark"><Icon name="store" size={16} /></span><strong>{store.name}</strong><span>{t.footerNote}</span></div>
        <a href={store.phoneHref}><Icon name="phone" size={16} /> {store.phoneDisplay}</a>
      </footer>

      <nav className="mobile-nav" aria-label={t.mobileNavigation}>
        <Link href="/" className="active" aria-current="page"><Icon name="home" size={19} /><span>{t.home}</span></Link>
        <a href="#products"><Icon name="grid" size={19} /><span>{t.allProducts}</span></a>
        <a href={store.phoneHref}><Icon name="phone" size={19} /><span>{t.call}</span></a>
      </nav>
    </div>
  );
}
