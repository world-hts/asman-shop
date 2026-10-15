"use client";

import Link from "next/link";
import { copy } from "@/lib/i18n";
import { useLanguagePreference } from "@/lib/use-language";
import { LanguageSwitcher } from "./LanguageSwitcher";

type Props = { kind: "not-found" | "error"; reset?: () => void };

export function LocalizedStatus({ kind, reset }: Props) {
  const [language, changeLanguage] = useLanguagePreference();
  const t = copy[language];
  const isError = kind === "error";

  return (
    <main className="not-found-page">
      <div className="not-found-card">
        <div className="status-topline">
          <span className="section-kicker">{isError ? "500" : "404"}</span>
          <LanguageSwitcher
            language={language}
            onChange={changeLanguage}
            ariaLabel={language === "tk" ? "Dil" : language === "ru" ? "Язык" : "Language"}
          />
        </div>
        <h1>{isError ? t.errorTitle : t.notFoundTitle}</h1>
        <p>{isError ? t.errorDescription : t.notFoundDescription}</p>
        <div className="not-found-actions">
          {isError && reset ? (
            <button className="primary-button" type="button" onClick={() => reset()}>{t.retry}</button>
          ) : null}
          <Link className={isError && reset ? "secondary-button" : "primary-button"} href="/">
            {t.homeButton}
          </Link>
        </div>
      </div>
    </main>
  );
}
