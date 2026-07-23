-- BuscaRepuesto: dealers independientes de auth + rol admin
-- Ejecutar en SQL Editor DESPUÉS de 001_init.sql (y seed si aplica).

-- 1) user_id opcional (self-serve); id deja de ser FK a auth.users
alter table public.dealers
  add column if not exists user_id uuid;

update public.dealers
set user_id = id
where user_id is null;

do $$
begin
  if exists (
    select 1
    from pg_constraint
    where conname = 'dealers_id_fkey'
      and conrelid = 'public.dealers'::regclass
  ) then
    alter table public.dealers drop constraint dealers_id_fkey;
  end if;
end $$;

-- FK blanda: si el user se borra, el local queda (user_id null)
alter table public.dealers
  drop constraint if exists dealers_user_id_fkey;

alter table public.dealers
  add constraint dealers_user_id_fkey
  foreign key (user_id) references auth.users (id) on delete set null;

alter table public.dealers
  alter column id set default gen_random_uuid();

create unique index if not exists dealers_user_id_uidx
  on public.dealers (user_id)
  where user_id is not null;

create index if not exists dealers_phone_idx on public.dealers (phone);

-- 2) Helper: ¿es admin?
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$;

-- 3) RLS dealers
drop policy if exists "dealers_owner_insert" on public.dealers;
drop policy if exists "dealers_owner_update" on public.dealers;
drop policy if exists "dealers_admin_insert" on public.dealers;
drop policy if exists "dealers_admin_update" on public.dealers;
drop policy if exists "dealers_admin_delete" on public.dealers;

create policy "dealers_owner_insert"
  on public.dealers for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "dealers_owner_update"
  on public.dealers for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "dealers_admin_insert"
  on public.dealers for insert
  to authenticated
  with check (public.is_admin());

create policy "dealers_admin_update"
  on public.dealers for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "dealers_admin_delete"
  on public.dealers for delete
  to authenticated
  using (public.is_admin());

-- 4) RLS listings (dueño vía dealers.user_id; admin todo)
drop policy if exists "listings_owner_insert" on public.listings;
drop policy if exists "listings_owner_update" on public.listings;
drop policy if exists "listings_owner_delete" on public.listings;
drop policy if exists "listings_admin_insert" on public.listings;
drop policy if exists "listings_admin_update" on public.listings;
drop policy if exists "listings_admin_delete" on public.listings;

create policy "listings_owner_insert"
  on public.listings for insert
  to authenticated
  with check (
    exists (
      select 1 from public.dealers d
      where d.id = dealer_id and d.user_id = auth.uid()
    )
  );

create policy "listings_owner_update"
  on public.listings for update
  to authenticated
  using (
    exists (
      select 1 from public.dealers d
      where d.id = dealer_id and d.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.dealers d
      where d.id = dealer_id and d.user_id = auth.uid()
    )
  );

create policy "listings_owner_delete"
  on public.listings for delete
  to authenticated
  using (
    exists (
      select 1 from public.dealers d
      where d.id = dealer_id and d.user_id = auth.uid()
    )
  );

create policy "listings_admin_insert"
  on public.listings for insert
  to authenticated
  with check (public.is_admin());

create policy "listings_admin_update"
  on public.listings for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "listings_admin_delete"
  on public.listings for delete
  to authenticated
  using (public.is_admin());
