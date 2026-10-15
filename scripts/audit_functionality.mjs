import { readFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");
const i18n = read("src/lib/i18n.ts");
const store = read("src/components/StoreShell.tsx");
const card = read("src/components/ProductCard.tsx");
const detail = read("src/components/ProductDetailClient.tsx");
const artwork = read("src/components/ProductArtwork.tsx");
const admin = read("src/components/AdminShell.tsx");
const status = read("src/components/LocalizedStatus.tsx");
const loading = read("src/components/LocalizedLoading.tsx");
const langHook = read("src/lib/use-language.ts");
const switcher = read("src/components/LanguageSwitcher.tsx");
const catalog = read("src/lib/catalog.ts");
const pwa = read("src/components/PwaRegister.tsx");
const sw = read("public/sw.js");
const data = read("src/lib/data.ts");

const failures = [];
function check(name, ok, detail = "ok") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name} — ${detail}`);
  if (!ok) failures.push(name);
}

function blockKeys(source, code) {
  const marker = `  ${code}: {`;
  const start = source.indexOf(marker);
  if (start < 0) return [];
  const end = source.indexOf("\n  },", start);
  if (end < 0) return [];
  return [...source.slice(start + marker.length, end).matchAll(/^    (\w+):/gm)].map((m) => m[1]);
}

const customerKeys = ["tk", "ru", "en"].map((code) => blockKeys(i18n, code));
check(
  "Customer copy keys equal",
  customerKeys.every((keys) => keys.join("|") === customerKeys[0].join("|")) && customerKeys[0].length >= 40,
  `${customerKeys[0]?.length ?? 0} keys x 3`,
);

const adminKeys = ["tk", "ru", "en"].map((code) => blockKeys(admin, code));
check(
  "Admin copy keys equal",
  adminKeys.every((keys) => keys.join("|") === adminKeys[0].join("|")) && adminKeys[0].length >= 50,
  `${adminKeys[0]?.length ?? 0} keys x 3`,
);

check("Language registry", /\{ code: "tk", label: "TK" \}/.test(i18n) && /\{ code: "ru", label: "RU" \}/.test(i18n) && /\{ code: "en", label: "EN" \}/.test(i18n) && /languages\.map/.test(switcher), "tk/ru/en");
check("Language persistence is shared", /useSyncExternalStore/.test(langHook) && /localStorage/.test(langHook) && /CHANGE_EVENT/.test(langHook), "hydration-safe + persistent");
check("Customer product name follows selected language", /product\.name\[language\]/.test(card), "name");
check("Customer product description follows selected language", /product\.description\[language\]/.test(detail), "description");
check("Customer category follows selected language", /categoryLabel\(product\.category, copy\[language\]\)/.test(artwork), "category");
check("Search covers all language fields", /product\.name\.tk, product\.name\.ru, product\.name\.en/.test(store) && /description\.tk, product\.description\.ru, product\.description\.en/.test(store), "tk/ru/en");
check("Dynamic search locale", /language === "tk" \? "tk-TM" : language === "ru" \? "ru-RU" : "en-US"/.test(store), "TK/RU/EN");
check("Localized status pages", /notFoundTitle|errorTitle/.test(status) && /useLanguagePreference/.test(status), "404/500");
check("Localized loading", /t\.loading/.test(loading), "loading label");
check("Localized JSON-LD primary language", /inLanguage: "tk"/.test(detail) && /product\.name\.tk/.test(detail), "TK metadata");
check("Hero count is dynamic", !/float-one"><span>12<\//.test(store) && /products\.length/.test(store), "no hard-coded count");
check("Next Link used for root navigation", /<Link href="\//.test(store), "no root <a>");
check("PWA registration is production-only", /NODE_ENV !== "production"/.test(pwa) && /asman-shop-v2/.test(sw), "no dev cache");
check("Supabase JSON ordering", /name->>tk/.test(catalog), "PostgREST text order");
check("Configured Supabase store errors fail visibly", /Store settings query failed/.test(catalog) && /if \(error\)[\s\S]*throw error/.test(catalog), "no demo fallback on remote error");
check("Configured Supabase product errors fail visibly", /Catalog query failed/.test(catalog) && /throw productError/.test(catalog), "no demo fallback on remote error");
check("Admin language persistence", /useLanguagePreference/.test(admin) && !/localStorage\.getItem\("magaza-language"\)/.test(admin), "shared hook");
check("Admin handles invalid currency", /invalidCurrency/.test(admin) && /\^\[A-Z\]\{3,5\}\$/.test(admin), "client validation");
check("Admin cleans replaced storage images", /originalImage/.test(admin) && /finalStoragePath/.test(admin), "old storage cleanup");
check("Admin confirmation follows current language", /product\.name\[language\]/.test(admin), "localized confirmation/table");
check("Demo products contain all languages", (data.match(/name: \{ tk:/g) ?? []).length >= 7 && (data.match(/ru:/g) ?? []).length >= 7 && (data.match(/en:/g) ?? []).length >= 7, "7 demo products");
check("No service-role secret pattern", !/SUPABASE_SERVICE_ROLE|service[_-]?role|sb_secret_/i.test(store + card + detail + admin + catalog), "client-safe");

if (failures.length) process.exitCode = 1;
