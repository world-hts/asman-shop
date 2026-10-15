-- V3/V7: tek mağaza için güvenli yönetim paneli
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

drop policy if exists "Admin can see own membership" on public.admin_users;
create policy "Admin can see own membership" on public.admin_users for select to authenticated using (user_id = auth.uid());

drop policy if exists "Admins can read all products" on public.products;
create policy "Admins can read all products" on public.products for select to authenticated using (exists (select 1 from public.admin_users where user_id = auth.uid()));
drop policy if exists "Admins can insert products" on public.products;
create policy "Admins can insert products" on public.products for insert to authenticated with check (exists (select 1 from public.admin_users where user_id = auth.uid()));
drop policy if exists "Admins can update products" on public.products;
create policy "Admins can update products" on public.products for update to authenticated using (exists (select 1 from public.admin_users where user_id = auth.uid())) with check (exists (select 1 from public.admin_users where user_id = auth.uid()));
drop policy if exists "Admins can delete products" on public.products;
create policy "Admins can delete products" on public.products for delete to authenticated using (exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "Admins can update store settings" on public.store_settings;
create policy "Admins can update store settings" on public.store_settings for update to authenticated using (exists (select 1 from public.admin_users where user_id = auth.uid())) with check (exists (select 1 from public.admin_users where user_id = auth.uid()));
drop policy if exists "Admins can insert store settings" on public.store_settings;
create policy "Admins can insert store settings" on public.store_settings for insert to authenticated with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

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

-- Yöneticinin UUID'sini buraya yazın:
-- insert into public.admin_users (user_id) values ('YOUR-AUTH-USER-UUID');
