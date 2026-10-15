# Supabase — Asman Shop V2

## Fresh project
Run in this order:

1. `schema.sql`
2. `seed.sql` (demo catalog only; replace for the real store)
3. `v3_admin.sql`

## Existing project
After the existing schema and admin setup are already present, run `v7_hardening.sql (historical hardening migration)`. If old data violates the new checks, clean the offending rows first and rerun the migration.

## Admin setup
1. Create the store manager in Supabase Authentication using email/password.
2. Copy that user's UUID.
3. Insert the UUID into `admin_users`:

```sql
insert into public.admin_users (user_id) values ('YOUR-AUTH-USER-UUID');
```

## App environment
Use the publishable key for the browser/SSR setup:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_SITE_URL=https://YOUR-DOMAIN.example
NEXT_PUBLIC_STORE_NAME=Asman Shop
NEXT_PUBLIC_STORE_PHONE=+993 XX XX XX XX
NEXT_PUBLIC_STORE_LOCATION=Türkmenistan
```

Legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY` is still accepted by the code as a fallback, but the publishable key is preferred.

Admin route: `/admin`

Product images are stored in the public `product-images` bucket under the `products/` prefix and are limited to JPG, PNG, WebP and AVIF with a 5 MB bucket limit.
