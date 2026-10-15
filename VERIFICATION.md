# V10 Verification Notes

Source base: `magaza-site-v9.zip`

## Static checks completed in this environment
- TypeScript/TSX syntax parsing: PASS after V9 edits
- JavaScript/MJS syntax checks: PASS after V9 edits
- Localization structure audit: PASS
- Language persistence architecture audit: PASS
- Product language rendering audit: PASS
- Search localization audit: PASS
- Localized 404/500/loading audit: PASS
- Supabase error/fallback audit: PASS
- PostgREST JSON ordering audit: PASS
- PWA production-registration audit: PASS
- Storage replacement cleanup audit: PASS
- Database requires non-empty TK/RU/EN product names: PASS

## Runtime gate on Mac
The supplied Mac log shows:
- `npm install`: PASS
- `next dev`: PASS
- V9 `npm run quality`: stopped at TypeScript with 1 error in `src/components/AdminShell.tsx`
- 5 high-severity npm audit findings were reported, but the pasted log does not include advisory/package identities

V10 does not claim the development-tooling deprecation is fixed without a compatibility-safe dependency plan. `npm run security:prod` was added to distinguish production dependency risk from development tooling risk. Do not use `npm audit fix --force` blindly. The 5 reported high findings must be identified first with the audit output.
