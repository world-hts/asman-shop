import Image from "next/image";
import { Icon } from "./icons";
import { categoryLabel, type Product } from "@/lib/data";
import { copy, type Language } from "@/lib/i18n";

export function ProductArtwork({ product, large = false, language = "tk" }: { product: Product; large?: boolean; language?: Language }) {
  if (product.image) {
    return (
      <div className={`product-art product-art-photo ${large ? "product-art-large" : ""}`}>
        <Image
          src={product.image}
          alt={product.name[language]}
          fill
          sizes={large ? "(max-width: 680px) 100vw, 55vw" : "(max-width: 680px) 50vw, 25vw"}
          className="product-photo"
          priority={large}
        />
      </div>
    );
  }

  return (
    <div className={`product-art product-art-${product.accent} ${large ? "product-art-large" : ""}`} aria-label={product.name[language]} role="img">
      <div className="art-glow" />
      <div className={`art-object art-${product.icon}`}>
        {product.icon === "phone" && <div className="phone-screen"><span className="screen-orb" /></div>}
        {product.icon === "headphones" && <><div className="headband" /><div className="earcup left" /><div className="earcup right" /></>}
        {product.icon === "watch" && <><div className="watch-strap top" /><div className="watch-face"><span>10:24</span></div><div className="watch-strap bottom" /></>}
        {product.icon === "charger" && <><div className="charger-body" /><div className="charger-prong one" /><div className="charger-prong two" /></>}
        {product.icon === "laptop" && <><div className="laptop-screen"><span className="screen-line" /></div><div className="laptop-base" /></>}
        {product.icon === "case" && <><div className="case-body"><Icon name="phone" size={50} /></div></>}
      </div>
      <span className="art-label">{categoryLabel(product.category, copy[language])}</span>
    </div>
  );
}
