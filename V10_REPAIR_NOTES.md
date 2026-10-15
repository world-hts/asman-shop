# V10 Repair Notes

## Fixed from V9 Mac quality run
- Fixed the TypeScript error `TS2339` in `src/components/AdminShell.tsx`.
- The `admin_users` Supabase query returns a `PromiseLike`, so chaining `.catch()` on that query was not type-safe.
- Replaced that chain with an async IIFE using `try/catch`, preserving the existing mounted guard and error handling.
- Bumped application version from `0.9.0` to `1.0.0`.

## V9 Mac results preserved
- `npm run verify`: PASS
- `npm run audit`: PASS
- `npm run audit:functionality`: PASS
- `npm run lint`: PASS
- `npm audit --omit=dev`: PASS — 0 production vulnerabilities reported

## Remaining item
- npm still reports the installed ESLint 9.39.5 package as deprecated/unsupported. This is development tooling; it is not a production dependency vulnerability according to `npm audit --omit=dev`. It should be upgraded only after confirming compatibility with the pinned Next.js/ESLint configuration.
