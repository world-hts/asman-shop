# Asman Shop — V2.0.0

**Asman Shop** is a mobile-first, single-store product catalogue for a phone and accessories shop. This release keeps the existing Next.js/Supabase application and gives the customer-facing storefront a cohesive sky-blue/turquoise visual redesign.

## Scope
- One store only — no multi-store layer.
- Product photo, name, price and stock.
- Store name, location and phone contact.
- Türkmençe (primary), Russian and English.
- Product search, category filtering, product details and phone contact.
- Existing Supabase-backed admin, product/image management and PWA foundation retained.
- No cart, checkout, payment, customer accounts or unnecessary store features.

## Stack
- Next.js 16 / React 19 / TypeScript
- Tailwind CSS 4 (existing PostCSS setup) plus custom responsive CSS
- Supabase JS + `@supabase/ssr`
- PWA service worker

## Local development (Mac)
This project intentionally has no lockfile in this archive yet. Use the package manager chosen for this project and commit the generated lockfile only after a successful install and quality run.

```bash
node -v
pnpm -v
pnpm install
pnpm run quality
pnpm run dev
```

Open `http://localhost:3000`. The sample catalogue is used only when Supabase environment variables are not configured. Replace the sample catalogue and placeholder store contact details before production.

## Environment
Copy `.env.example` to `.env.local`, then set real values:
- `NEXT_PUBLIC_STORE_NAME=Asman Shop`
- `NEXT_PUBLIC_STORE_PHONE`
- `NEXT_PUBLIC_STORE_LOCATION`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SITE_URL`

Never put a Supabase service-role key in a `NEXT_PUBLIC_` variable or browser source.

## Supabase
For a fresh project, follow `supabase/README.md` and run the SQL scripts in the documented order. The seed is demo content, not the shop's real product list. For an already configured database, do not rerun the demo seed or production placeholder script blindly; update the store name/contact through the admin panel and import the real catalogue.

## Quality gate
```bash
pnpm run verify
pnpm run audit
pnpm run audit:functionality
pnpm run lint
pnpm run typecheck
pnpm run build
pnpm run security:prod
```

A static source archive is not a substitute for running these checks on the target Mac or testing real Supabase authentication and CRUD with the shop's own credentials.
