# Final store launch checklist — V10

## Store identity
- [ ] Store name entered
- [ ] Store phone entered and verified
- [ ] Store location entered
- [ ] Production site URL entered

## Catalog
- [ ] Real product names entered in TK/RU/EN
- [ ] Real photos uploaded
- [ ] Real prices entered
- [ ] Real stock entered
- [ ] Demo products removed after import

## Functional QA
- [ ] `npm install` PASS
- [ ] `npm run quality` PASS
- [ ] TK → RU → EN switch on home
- [ ] Language survives reload
- [ ] Search works with each language
- [ ] Category filter works
- [ ] Product names/descriptions/prices switch language
- [ ] Product detail switch works and persists
- [ ] 404 page respects selected language
- [ ] 500/loading copy is localized
- [ ] Phone link opens correctly
- [ ] Mobile Android-size viewport checked
- [ ] Mobile iPhone-size viewport checked

## Supabase/admin
- [ ] Production Supabase configured
- [ ] Admin login works
- [ ] Add product works
- [ ] Edit product works
- [ ] Stock update works
- [ ] Active/featured toggles work
- [ ] Image upload works
- [ ] Image replacement deletes old storage file
- [ ] Product deletion cleans storage file
- [ ] Sign-out clears admin state

## Security/deploy
- [ ] `npm run security:prod` reviewed
- [ ] No service-role key in frontend env/source
- [ ] Production `NEXT_PUBLIC_SITE_URL` configured
- [ ] Vercel environment variables configured
- [ ] Live `/` verified
- [ ] Live product URL verified
- [ ] Live `/admin` verified
