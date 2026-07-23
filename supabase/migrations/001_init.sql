-- BuscaRepuesto: dealers + listings + RLS
create extension if not exists "pgcrypto";

-- Nota: en proyectos nuevos preferir 001 + 002 juntos.
-- 001 histórico: id = auth.users. 002 desacopla y agrega user_id.
create table if not exists public.dealers (
  id uuid primary key references auth.users (id) on delete cascade,
  business_name text not null,
  phone text not null,
  address text not null,
  state text not null,
  city text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid not null references public.dealers (id) on delete cascade,
  part_number text not null,
  name text not null,
  brand text not null default '—',
  model text not null default '',
  observation text not null default 'Nuevo',
  created_at timestamptz not null default now()
);

create index if not exists listings_part_number_idx
  on public.listings (part_number);

create index if not exists listings_dealer_id_idx
  on public.listings (dealer_id);

create index if not exists dealers_state_idx
  on public.dealers (state);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists dealers_set_updated_at on public.dealers;
create trigger dealers_set_updated_at
before update on public.dealers
for each row execute function public.set_updated_at();

alter table public.dealers enable row level security;
alter table public.listings enable row level security;

-- Lectura pública
drop policy if exists "dealers_public_read" on public.dealers;
create policy "dealers_public_read"
  on public.dealers for select
  to anon, authenticated
  using (true);

drop policy if exists "listings_public_read" on public.listings;
create policy "listings_public_read"
  on public.listings for select
  to anon, authenticated
  using (true);

-- Dueño escribe su perfil
drop policy if exists "dealers_owner_insert" on public.dealers;
create policy "dealers_owner_insert"
  on public.dealers for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "dealers_owner_update" on public.dealers;
create policy "dealers_owner_update"
  on public.dealers for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Dueño escribe sus listings
drop policy if exists "listings_owner_insert" on public.listings;
create policy "listings_owner_insert"
  on public.listings for insert
  to authenticated
  with check (auth.uid() = dealer_id);

drop policy if exists "listings_owner_update" on public.listings;
create policy "listings_owner_update"
  on public.listings for update
  to authenticated
  using (auth.uid() = dealer_id)
  with check (auth.uid() = dealer_id);

drop policy if exists "listings_owner_delete" on public.listings;
create policy "listings_owner_delete"
  on public.listings for delete
  to authenticated
  using (auth.uid() = dealer_id);
