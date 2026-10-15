-- V7 hardening migration for an existing V5/V6 Supabase project.
-- Run this after schema.sql + v3_admin.sql on the existing database.

alter table public.store_settings
  drop constraint if exists store_settings_name_check,
  drop constraint if exists store_settings_phone_display_check,
  drop constraint if exists store_settings_phone_href_check,
  drop constraint if exists store_settings_location_check;

alter table public.store_settings
  add constraint store_settings_name_check check (length(trim(name)) > 0 and length(name) <= 160),
  add constraint store_settings_phone_display_check check (length(trim(phone_display)) > 0 and length(phone_display) <= 60),
  add constraint store_settings_phone_href_check check (phone_href ~ '^tel:\+?[0-9]+$'),
  add constraint store_settings_location_check check (length(trim(location)) > 0 and length(location) <= 200);

alter table public.products
  drop constraint if exists products_slug_check,
  drop constraint if exists products_currency_check,
  drop constraint if exists products_image_check,
  drop constraint if exists products_category_check,
  drop constraint if exists products_accent_check,
  drop constraint if exists products_icon_check,
  drop constraint if exists products_sort_order_check,
  drop constraint if exists products_name_check,
  drop constraint if exists products_description_check;

alter table public.products
  add constraint products_slug_check check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' and length(slug) <= 70),
  add constraint products_currency_check check (currency ~ '^[A-Z]{3,5}$'),
  add constraint products_image_check check (image is null or image ~ '^/products/' or image ~ '^https://([A-Za-z0-9-]+\.)*supabase\.co(/|$)'),
  add constraint products_category_check check (category in ('phones', 'accessories', 'audio', 'watches', 'charging', 'laptops')),
  add constraint products_accent_check check (accent in ('blue', 'ice', 'sky', 'navy', 'silver', 'mint')),
  add constraint products_icon_check check (icon in ('phone', 'headphones', 'watch', 'charger', 'laptop', 'case')),
  add constraint products_sort_order_check check (sort_order >= 0),
  add constraint products_name_check check (jsonb_typeof(name) = 'object' and jsonb_typeof(name->'tk') = 'string' and jsonb_typeof(name->'ru') = 'string' and jsonb_typeof(name->'en') = 'string' and length(trim(name->>'tk')) between 1 and 160 and length(trim(name->>'ru')) between 1 and 160 and length(trim(name->>'en')) between 1 and 160),
  add constraint products_description_check check (jsonb_typeof(description) = 'object' and jsonb_typeof(description->'tk') = 'string' and jsonb_typeof(description->'ru') = 'string' and jsonb_typeof(description->'en') = 'string');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_store_settings_updated_at on public.store_settings;
create trigger set_store_settings_updated_at before update on public.store_settings for each row execute function public.set_updated_at();
drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at before update on public.products for each row execute function public.set_updated_at();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, '5MB', array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do update set public = true, file_size_limit = '5MB', allowed_mime_types = array['image/jpeg','image/png','image/webp','image/avif'];

drop policy if exists "Public can read product images" on storage.objects;
create policy "Public can read product images" on storage.objects for select using (bucket_id = 'product-images' and (storage.foldername(name))[1] = 'products');
drop policy if exists "Admins can upload product images" on storage.objects;
create policy "Admins can upload product images" on storage.objects for insert to authenticated with check (bucket_id = 'product-images' and (storage.foldername(name))[1] = 'products' and exists (select 1 from public.admin_users where user_id = auth.uid()));
drop policy if exists "Admins can update product images" on storage.objects;
create policy "Admins can update product images" on storage.objects for update to authenticated using (bucket_id = 'product-images' and (storage.foldername(name))[1] = 'products' and exists (select 1 from public.admin_users where user_id = auth.uid())) with check (bucket_id = 'product-images' and (storage.foldername(name))[1] = 'products' and exists (select 1 from public.admin_users where user_id = auth.uid()));
drop policy if exists "Admins can delete product images" on storage.objects;
create policy "Admins can delete product images" on storage.objects for delete to authenticated using (bucket_id = 'product-images' and (storage.foldername(name))[1] = 'products' and exists (select 1 from public.admin_users where user_id = auth.uid()));
