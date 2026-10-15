"use client";

import { useCallback, useSyncExternalStore } from "react";
import { type Language } from "./i18n";

const STORAGE_KEY = "magaza-language";
const CHANGE_EVENT = "magaza-language-change";
let memoryLanguage: Language = "tk";

function isLanguage(value: string | null): value is Language {
  return value === "tk" || value === "ru" || value === "en";
}

function readLanguage(): Language {
  if (typeof window === "undefined") return "tk";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLanguage(stored)) {
      memoryLanguage = stored;
      return stored;
    }
  } catch {
    // Continue with the in-memory language when storage is unavailable.
  }
  return memoryLanguage;
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => undefined;

  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === STORAGE_KEY) onStoreChange();
  };
  const onCustomChange = () => onStoreChange();

  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, onCustomChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, onCustomChange);
  };
}

export function useLanguagePreference() {
  const language = useSyncExternalStore(subscribe, readLanguage, () => "tk" as const);
  const changeLanguage = useCallback((next: Language) => {
    memoryLanguage = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // The language still remains active for this page even without storage.
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);
  return [language, changeLanguage] as const;
}
