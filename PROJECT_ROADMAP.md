# Asman Shop Roadmap

## Completed foundations carried forward
- V1 — Sky-blue single-store storefront foundation.
- V2 — Supabase catalog/data foundation.
- V3 — Single-store admin.
- V4 — Mobile/PWA/SEO polish.
- V5–V11 — Production preparation, audits, type fixes and hydration stability repairs.

## Current release
- **Asman Shop V2.0.0 — visual redesign.** Reuses the existing app rather than rewriting working backend features.

## Mac acceptance checklist
1. `pnpm install`
2. `pnpm run quality`
3. `pnpm run security:prod`
4. `pnpm run dev` and inspect desktop + mobile sizes.
5. Switch TK/RU/EN and verify labels, prices and product names.
6. Test search, category filters, product detail, stock states and phone link.
7. Test `/urunler/does-not-exist` for the localized 404.
8. With real Supabase settings, test admin login, product create/edit/delete, stock, image upload/replacement/deletion and store contact settings.
9. Verify PWA name/icon/cache behavior.
10. Only after checks pass, publish V2 and keep a known-good backup of the previous release.

## Explicit exclusions
Single store only. No cart, checkout, online payment, customer accounts, favorites or multi-store support.
