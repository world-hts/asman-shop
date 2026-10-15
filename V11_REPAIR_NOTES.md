# V11.0.0 Repair Notes

## Hydration mismatch
The browser reported a React hydration mismatch in `ProductCard.tsx` because `formatPrice()` used `toLocaleString()` with `tk-TM`; server and browser ICU locale data produced different thousands separators.

V11 now formats prices deterministically with `.` thousands separators and `,` decimal separator, so SSR and browser output are identical.

## Next.js scroll warning
Added `data-scroll-behavior="smooth"` to the root `<html>` element as requested by Next.js when CSS sets `scroll-behavior: smooth`.

## Validation
Run on Mac:

```bash
npm install
npm run quality
```

Then manually verify `http://localhost:3000` in the browser and confirm there is no hydration mismatch.
