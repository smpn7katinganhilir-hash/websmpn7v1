-- SMPN 7 Katingan Hilir website: initial schema
-- Apply through Supabase SQL Editor or Supabase CLI after reviewing.
create extension if not exists pgcrypto;

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  role text not null default 'editor' check (role in ('super_admin','admin','editor')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  icon text,
  cover_url text,
  summary text not null default '',
  body text not null default '',
  objectives jsonb not null default '[]'::jsonb,
  activities jsonb not null default '[]'::jsonb,
  schedule text,
  impact text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  sort_order int not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  recipient text not null,
  category text not null default 'murid',
  level text,
  achievement_year int,
  description text not null default '',
  photo_url text,
  certificate_url text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.gallery_albums (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'Kegiatan Sekolah',
  album_date date,
  description text not null default '',
  cover_url text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  sort_order int not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.gallery_albums(id) on delete cascade,
  image_url text not null,
  caption text NOT NULL DEFAULT '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create table if not exists public.digital_works (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author_name text not null,
  category text not null default 'Karya Murid',
  synopsis text not null default '',
  cover_url text,
  flipbook_url text,
  publication_year int,
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  sort_order int not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null default 'Informasi Sekolah',
  content text not null,
  cover_url text,
  attachment_url text,
  priority text not null default 'normal' check (priority in ('normal','important','urgent')),
  status text not null default 'draft' check (status in ('draft','published','archived')),
  published_at timestamptz,
  expires_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.guestbook_entries (
  id uuid primary key default gen_random_uuid(),
  visitor_name text not null,
  institution text,
  origin text,
  purpose text not null,
  message text not null,
  moderation_status text not null default 'pending' check (moderation_status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);
create table if not exists public.activity_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity text not null,
  entity_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Admin helper: active admin/editor role check, evaluated by RLS.
create or replace function public.is_site_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (
  select 1 from public.user_profiles p
  where p.id = auth.uid() and p.active = true and p.role in ('super_admin','admin','editor')
); $$;
create or replace function public.is_super_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (
  select 1 from public.user_profiles p
  where p.id = auth.uid() and p.active = true and p.role = 'super_admin'
); $$;

-- Enable RLS on all tables.
alter table public.user_profiles enable row level security;
alter table public.programs enable row level security;
alter table public.achievements enable row level security;
alter table public.gallery_albums enable row level security;
alter table public.gallery_photos enable row level security;
alter table public.digital_works enable row level security;
alter table public.announcements enable row level security;
alter table public.guestbook_entries enable row level security;
alter table public.site_settings enable row level security;
alter table public.activity_logs enable row level security;

-- Public may only read published content.
create policy "public read published programs" on public.programs for select to anon, authenticated using (status='published');
create policy "admins manage programs" on public.programs for all to authenticated using (public.is_site_admin()) with check (public.is_site_admin());
create policy "public read published achievements" on public.achievements for select to anon, authenticated using (status='published');
create policy "admins manage achievements" on public.achievements for all to authenticated using (public.is_site_admin()) with check (public.is_site_admin());
create policy "public read published albums" on public.gallery_albums for select to anon, authenticated using (status='published');
create policy "admins manage albums" on public.gallery_albums for all to authenticated using (public.is_site_admin()) with check (public.is_site_admin());
create policy "public read photos of published albums" on public.gallery_photos for select to anon, authenticated using (exists(select 1 from public.gallery_albums a where a.id=album_id and a.status='published'));
create policy "admins manage photos" on public.gallery_photos for all to authenticated using (public.is_site_admin()) with check (public.is_site_admin());
create policy "public read published digital works" on public.digital_works for select to anon, authenticated using (status='published');
create policy "admins manage digital works" on public.digital_works for all to authenticated using (public.is_site_admin()) with check (public.is_site_admin());
create policy "public read published announcements" on public.announcements for select to anon, authenticated using (status='published' and (expires_at is null or expires_at >= now()));
create policy "admins manage announcements" on public.announcements for all to authenticated using (public.is_site_admin()) with check (public.is_site_admin());
-- Guestbook public insert is intentionally not granted here. Later it will go through a server-side
-- function that verifies Cloudflare Turnstile, validates input and rate-limits requests.
create policy "admins manage guestbook" on public.guestbook_entries for all to authenticated using (public.is_site_admin()) with check (public.is_site_admin());
create policy "admins read settings" on public.site_settings for select to authenticated using (public.is_site_admin());
create policy "super admins manage settings" on public.site_settings for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "admins read activity logs" on public.activity_logs for select to authenticated using (public.is_site_admin());
create policy "super admins read profiles" on public.user_profiles for select to authenticated using (public.is_super_admin());
create policy "users read own profile" on public.user_profiles for select to authenticated using (id=auth.uid());
create policy "super admins manage profiles" on public.user_profiles for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());

-- Grants are intentionally minimal; RLS remains the row-level guard.
revoke all on public.activity_logs from anon, authenticated;
revoke all on public.site_settings from anon;
revoke all on public.user_profiles from anon;
