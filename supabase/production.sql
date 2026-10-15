-- Production store setup.
-- Fresh project: schema.sql -> seed.sql -> v3_admin.sql.
-- Existing V5/V6 project: apply v7_hardening.sql first.

update public.store_settings
set
  name = 'Asman Shop',
  phone_display = '+993 XX XX XX XX',
  phone_href = 'tel:+99300000000',
  location = 'Türkmenistan',
  updated_at = now()
where id = 1;

-- After the real catalog is imported, delete demo rows if still present:
-- delete from public.products;
