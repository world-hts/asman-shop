"use client";

import { copy } from "@/lib/i18n";
import { useLanguagePreference } from "@/lib/use-language";

export function LocalizedLoading() {
  const [language] = useLanguagePreference();
  const t = copy[language];
  return (
    <main className="loading-page" aria-busy="true" aria-label={t.loading}>
      <div className="loading-card">
        <span className="loading-mark" aria-hidden="true" />
        <strong>{t.loading}</strong>
      </div>
    </main>
  );
}
