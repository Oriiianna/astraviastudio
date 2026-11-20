-- ============================================================
-- Esquema del panel de administración de Astravia (Supabase)
-- ------------------------------------------------------------
-- Para recrear el proyecto en otra cuenta: pegar este archivo en
-- Supabase → SQL Editor y ejecutarlo; después ejecutar seed.sql.
-- Equivale a las migraciones aplicadas al proyecto original.
-- ============================================================

-- ---------- Admins ----------
-- Solo los usuarios dados de alta acá pueden escribir en el panel.
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

drop policy if exists "admin lee su propia fila" on public.admins;
create policy "admin lee su propia fila" on public.admins
  for select to authenticated
  using (user_id = (select auth.uid()));

-- ---------- Proyectos del portfolio ----------
create table if not exists public.proyectos (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  url text not null default '',
  accent text not null default '#7c3aed',
  imagen text not null default '',
  imagen_movil text not null default '',
  publicado boolean not null default true,
  destacado boolean not null default false,
  orden integer not null default 0,
  es jsonb not null default '{}'::jsonb,
  en jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.proyectos enable row level security;

create index if not exists proyectos_destacado_orden_idx on public.proyectos (destacado, orden);

drop policy if exists "publico lee publicados" on public.proyectos;
create policy "publico lee publicados" on public.proyectos
  for select to anon, authenticated
  using (publicado = true);

drop policy if exists "admin lee todo" on public.proyectos;
create policy "admin lee todo" on public.proyectos
  for select to authenticated
  using (exists (select 1 from public.admins a where a.user_id = (select auth.uid())));

drop policy if exists "admin inserta" on public.proyectos;
create policy "admin inserta" on public.proyectos
  for insert to authenticated
  with check (exists (select 1 from public.admins a where a.user_id = (select auth.uid())));

drop policy if exists "admin actualiza" on public.proyectos;
create policy "admin actualiza" on public.proyectos
  for update to authenticated
  using (exists (select 1 from public.admins a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.admins a where a.user_id = (select auth.uid())));

drop policy if exists "admin borra" on public.proyectos;
create policy "admin borra" on public.proyectos
  for delete to authenticated
  using (exists (select 1 from public.admins a where a.user_id = (select auth.uid())));

-- Mantiene updated_at al día
create or replace function public.tocar_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists proyectos_updated_at on public.proyectos;
create trigger proyectos_updated_at before update on public.proyectos
  for each row execute function public.tocar_updated_at();

-- Tope de 6 destacados (los que se ven en el home), impuesto por la base.
create or replace function public.limitar_destacados() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.destacado and (
    select count(*) from public.proyectos where destacado and id <> new.id
  ) >= 6 then
    raise exception 'Solo puede haber 6 proyectos destacados' using errcode = '23514';
  end if;
  return new;
end $$;

drop trigger if exists proyectos_limitar_destacados on public.proyectos;
create trigger proyectos_limitar_destacados
  before insert or update of destacado on public.proyectos
  for each row when (new.destacado)
  execute function public.limitar_destacados();

-- ---------- Permisos base de la API ----------
-- Los proyectos nuevos de Supabase no dan acceso automático a las tablas de
-- `public`: sin estos GRANT la API responde "permission denied" aunque las
-- políticas RLS estén bien. RLS decide QUÉ filas; el GRANT decide si se puede
-- tocar la tabla. Se quita lo que sobra (p. ej. TRUNCATE) y se da lo justo.
revoke all on public.proyectos, public.admins from anon, authenticated;
grant select on public.proyectos to anon;
grant select, insert, update, delete on public.proyectos to authenticated;
grant select on public.admins to authenticated;

-- ---------- Capturas (Storage) ----------
-- Bucket público: lectura abierta, escritura solo para admins.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('proyectos', 'proyectos', true, 5242880, array['image/webp', 'image/png', 'image/jpeg'])
on conflict (id) do nothing;

drop policy if exists "admin sube capturas" on storage.objects;
create policy "admin sube capturas" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'proyectos'
    and exists (select 1 from public.admins a where a.user_id = (select auth.uid())));

drop policy if exists "admin reemplaza capturas" on storage.objects;
create policy "admin reemplaza capturas" on storage.objects
  for update to authenticated
  using (bucket_id = 'proyectos'
    and exists (select 1 from public.admins a where a.user_id = (select auth.uid())));

drop policy if exists "admin borra capturas" on storage.objects;
create policy "admin borra capturas" on storage.objects
  for delete to authenticated
  using (bucket_id = 'proyectos'
    and exists (select 1 from public.admins a where a.user_id = (select auth.uid())));

-- Supabase exige poder listar para poder borrar.
drop policy if exists "admin lista capturas" on storage.objects;
create policy "admin lista capturas" on storage.objects
  for select to authenticated
  using (bucket_id = 'proyectos'
    and exists (select 1 from public.admins a where a.user_id = (select auth.uid())));

-- ---------- Alta de un admin ----------
-- 1) Crear el usuario en Authentication → Users → Add user (auto-confirmar).
-- 2) Darlo de alta como admin (cambiar el email):
--
--   insert into public.admins (user_id, email)
--   select id, email from auth.users where email = 'admin@ejemplo.com';
