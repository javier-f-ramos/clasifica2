-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- 1. Categories Table
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- 2. Listings Table
create type listing_status as enum ('published', 'paused', 'deleted');

create table if not exists public.listings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) not null,
  category_id uuid references public.categories(id) not null,
  title text not null,
  description text not null,
  price numeric check (price >= 0),
  is_free boolean default false,
  province text not null,
  city text not null,
  youtube_url text,
  status listing_status default 'published',
  featured_until timestamptz,
  premium_until timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Listing Images
create table if not exists public.listing_images (
  id uuid primary key default uuid_generate_v4(),
  listing_id uuid references public.listings(id) on delete cascade not null,
  storage_path text not null,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- 4. Payments Log
create type payment_type as enum ('featured', 'premium');

create table if not exists public.payments_log (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) not null,
  listing_id uuid references public.listings(id) not null,
  type payment_type not null,
  amount numeric not null,
  days int not null,
  stripe_checkout_session_id text,
  status text default 'pending',
  created_at timestamptz default now()
);

-- RLS Policies
-- Categories
alter table public.categories enable row level security;
create policy "Categories are viewable by everyone" on public.categories for select using (true);

-- Listings
alter table public.listings enable row level security;
create policy "Listings are viewable by everyone" on public.listings for select using (
  status = 'published' or auth.uid() = user_id
);
create policy "Users can insert their own listings" on public.listings for insert with check (
  auth.uid() = user_id
);
create policy "Users can update their own listings" on public.listings for update using (
  auth.uid() = user_id
);

-- Listing Images
alter table public.listing_images enable row level security;
create policy "Images viewable by everyone" on public.listing_images for select using (true);
create policy "Users can insert images for their listings" on public.listing_images for insert with check (
  exists (select 1 from public.listings where id = listing_id and user_id = auth.uid())
);
create policy "Users can delete images for their listings" on public.listing_images for delete using (
  exists (select 1 from public.listings where id = listing_id and user_id = auth.uid())
);

-- Payments Log
alter table public.payments_log enable row level security;
create policy "Users can view their own payments" on public.payments_log for select using (
  auth.uid() = user_id
);

-- Limit 10 active ads enforcement (Function + Trigger)
create or replace function check_active_listings_limit()
returns trigger as $$
begin
  -- Count only PUBLISHED ads as 'active' for the limit. 
  -- (If user pauses an ad, it doesn't count, allowing them to publish another).
  if (select count(*) from public.listings where user_id = auth.uid() and status = 'published') >= 10 then
    -- Block if we are inserting a published ad OR updating an ad to be published
    if TG_OP = 'INSERT' and NEW.status = 'published' then
       raise exception 'Limit of 10 active ads reached.';
    end if;
     if TG_OP = 'UPDATE' and NEW.status = 'published' and OLD.status <> 'published' then
       raise exception 'Limit of 10 active ads reached.';
    end if;
  end if;
  return NEW;
end;
$$ language plpgsql;

drop trigger if exists enforce_active_listings_limit on public.listings;
create trigger enforce_active_listings_limit
before insert or update on public.listings
for each row execute function check_active_listings_limit();

-- Seed Categories (UPSERT to avoid duplicates)
insert into public.categories (name, slug, sort_order) values
('Aficiones y ocio', 'aficiones-y-ocio', 1),
('Animales', 'animales', 2),
('Deportes', 'deportes', 3),
('Formación y empleo', 'formacion-y-empleo', 4),
('Hogar y jardín', 'hogar-y-jardin', 5),
('Imagen, libros y sonido', 'imagen-libros-y-sonido', 6),
('Informática', 'informatica', 7),
('Inmobiliaria', 'inmobiliaria', 8),
('Juegos', 'juegos', 9),
('Moda y accesorios', 'moda-y-accesorios', 10),
('Motor', 'motor', 11),
('Negocios y servicios', 'negocios-y-servicios', 12),
('Niños y bebés', 'ninos-y-bebes', 13),
('Telefonía', 'telefonia', 14),
('Contactos', 'contactos', 15)
on conflict (slug) do nothing;
