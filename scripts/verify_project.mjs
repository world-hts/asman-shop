import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const required = [
  "package.json", "src/app/page.tsx", "src/app/urunler/[slug]/page.tsx",
  "src/components/StoreShell.tsx", "src/components/AdminShell.tsx",
  "src/lib/catalog.ts", "src/lib/i18n.ts", "src/lib/site.ts",
  "supabase/schema.sql", "supabase/v3_admin.sql", "supabase/v7_hardening.sql",
  "scripts/audit_project.mjs", ".env.example", "public/manifest.webmanifest", "public/sw.js",
];
const missing = required.filter((file) => !existsSync(join(root, file)));
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const sourceText = required.filter((file) => file.startsWith("src/") && /\.(ts|tsx)$/.test(file)).map((file) => readFileSync(join(root, file), "utf8")).join("\n");
const forbidden = /SUPABASE_SERVICE_ROLE|service[_-]?role|sb_secret_/i.test(sourceText);
const checks = [
  ["required files", missing.length === 0, missing.length ? missing.join(", ") : "ok"],
  ["single store", readFileSync(join(root, "supabase/schema.sql"), "utf8").includes("check (id = 1)"), "store_settings.id=1"],
  ["three languages", ["tk", "ru", "en"].every((code) => readFileSync(join(root, "src/lib/i18n.ts"), "utf8").includes(code)), "tk/ru/en"],
  ["no service role in source", !forbidden, forbidden ? "secret pattern found" : "ok"],
  ["SSR auth package", Boolean(pkg.dependencies?.["@supabase/ssr"]), "@supabase/ssr"],
  ["Next admin proxy", readFileSync(join(root, "proxy.ts"), "utf8").includes("/admin/:path*"), "admin matcher"],
  ["audit script wired", pkg.scripts?.audit === "node scripts/audit_project.mjs", "npm run audit"],
];
let failed = false;
for (const [name, ok, detail] of checks) { console.log(`${ok ? "PASS" : "FAIL"}  ${name} — ${detail}`); failed ||= !ok; }
for (const file of ["README.md", "PROJECT_ROADMAP.md", "VERSION.md", "VERIFICATION.md"]) { if (existsSync(join(root, file)) && statSync(join(root, file)).size === 0) { console.log(`FAIL  ${file} — empty file`); failed = true; } }
process.exitCode = failed ? 1 : 0;
