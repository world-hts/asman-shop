-- V2/V7: tek mağaza katalog verisi + veri bütünlüğü
create table if not exists public.store_settings (
  id integer primary key default 1 check (id = 1),
  name text not null check (length(trim(name)) > 0 and length(name) <= 160),
  phone_display text not null check (length(trim(phone_display)) > 0 and length(phone_display) <= 60),
  phone_href text not null check (phone_href ~ '^tel:\+?[0-9]+$'),
  location text not null default 'Türkmenistan' check (length(trim(location)) > 0 and length(location) <= 200),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id text primary key,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' and length(slug) <= 70),
  name jsonb not null check (jsonb_typeof(name) = 'object' and jsonb_typeof(name->'tk') = 'string' and jsonb_typeof(name->'ru') = 'string' and jsonb_typeof(name->'en') = 'string' and length(trim(name->>'tk')) between 1 and 160 and length(trim(name->>'ru')) between 1 and 160 and length(trim(name->>'en')) between 1 and 160),
  description jsonb not null default '{}'::jsonb check (jsonb_typeof(description) = 'object' and jsonb_typeof(description->'tk') = 'string' and jsonb_typeof(description->'ru') = 'string' and jsonb_typeof(description->'en') = 'string'),
  category text not null check (category in ('phones', 'accessories', 'audio', 'watches', 'charging', 'laptops')),
  price numeric(14,2) not null check (price >= 0),
  currency text not null default 'TMT' check (currency ~ '^[A-Z]{3,5}$'),
  stock integer not null default 0 check (stock >= 0),
  image text check (image is null or image ~ '^/products/' or image ~ '^https://([A-Za-z0-9-]+\.)*supabase\.co(/|$)'),
  accent text not null default 'blue' check (accent in ('blue', 'ice', 'sky', 'navy', 'silver', 'mint')),
  icon text not null default 'phone' check (icon in ('phone', 'headphones', 'watch', 'charger', 'laptop', 'case')),
  featured boolean not null default false,
  active boolean not null default true,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_active_sort_idx on public.products (active, featured desc, sort_order asc);

alter table public.store_settings enable row level security;
alter table public.products enable row level security;

drop policy if exists "Public can read store settings" on public.store_settings;
create policy "Public can read store settings" on public.store_settings for select using (true);

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products" on public.products for select using (active = true);

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
