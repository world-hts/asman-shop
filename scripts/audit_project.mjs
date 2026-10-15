import { existsSync, readFileSync, readdirSync } from "node:fs";
import { extname, join } from "node:path";

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), "utf8");
const packageJson = JSON.parse(read("package.json"));
const files = [];
function walk(dir) {
  for (const item of readdirSync(join(root, dir), { withFileTypes: true })) {
    if (item.name === "node_modules" || item.name === ".next") continue;
    const rel = join(dir, item.name);
    if (item.isDirectory()) walk(rel); else files.push(rel);
  }
}
walk("src");

const sourceText = files.filter((f) => /\.(ts|tsx)$/.test(extname(f))).map(read).join("\n");
const checks = [
  ["Next.js security target", packageJson.dependencies?.next === "^16.3.8", packageJson.dependencies?.next],
  ["React target", packageJson.dependencies?.react === "^19.3.0", packageJson.dependencies?.react],
  ["Supabase JS target", packageJson.dependencies?.["@supabase/supabase-js"] === "^2.117.2", packageJson.dependencies?.["@supabase/supabase-js"]],
  ["Supabase SSR target", packageJson.dependencies?.["@supabase/ssr"] === "^0.12.7", packageJson.dependencies?.["@supabase/ssr"]],
  ["Three languages", /tk/.test(read("src/lib/i18n.ts")) && /ru/.test(read("src/lib/i18n.ts")) && /en/.test(read("src/lib/i18n.ts")), "tk/ru/en"],
  ["Single-store invariant", /check \(id = 1\)/.test(read("supabase/schema.sql")), "store_settings.id=1"],
  ["No service-role secret in client source", !/SUPABASE_SERVICE_ROLE|service[_-]?role|sb_secret_/i.test(sourceText), "ok"],
  ["No silent demo fallback with Supabase", !/if \(error.*return localStore/s.test(read("src/lib/catalog.ts").replace(/\n/g, " ")) && /throw productError/.test(read("src/lib/catalog.ts")), "ok"],
  ["Exact image MIME allowlist", /image\/jpeg.*image\/png.*image\/webp.*image\/avif/s.test(read("src/components/AdminShell.tsx")), "jpg/png/webp/avif"],
  ["5MB client image limit", /5 \* 1024 \* 1024/.test(read("src/components/AdminShell.tsx")), "5MB"],
  ["Product images use safe paths", /startsWith\("\/products\/"\)/.test(read("src/lib/site.ts")), "local images stay under /products/"],
  ["Storage hardening", /storage\.foldername\(name\)\)\[1\] = 'products'/.test(read("supabase/v7_hardening.sql")), "products prefix"],
  ["JSON-LD escaped", /JSON\.stringify\(productJsonLd\)\.replace\(\/</.test(read("src/components/ProductDetailClient.tsx")), "escaped"],
  ["PWA icons", existsSync(join(root, "public/icons/icon-192.png")) && existsSync(join(root, "public/icons/icon-512.png")), "192/512"],
];
let failed = false;
for (const [name, ok, detail] of checks) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name} — ${detail}`);
  failed ||= !ok;
}
process.exitCode = failed ? 1 : 0;
