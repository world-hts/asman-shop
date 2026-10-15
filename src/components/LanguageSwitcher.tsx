"use client";

import { languages, type Language } from "@/lib/i18n";

export function LanguageSwitcher({ language, onChange, ariaLabel = "Language" }: { language: Language; onChange: (language: Language) => void; ariaLabel?: string }) {
  return (
    <div className="language-switcher" role="group" aria-label={ariaLabel}>
      {languages.map((item) => (
        <button key={item.code} type="button" className={language === item.code ? "active" : ""} onClick={() => onChange(item.code)} aria-pressed={language === item.code}>
          {item.label}
        </button>
      ))}
    </div>
  );
}
