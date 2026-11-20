-- Security hardening for SMPN 7 Katingan Hilir website.
-- Apply AFTER 202611200001_initial_schema.sql.
-- Roles: super_admin (users/settings), admin (content), editor (content).

create or replace function public.is_content_manager()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_profiles p
    where p.id = auth.uid()
      and p.active = true
      and p.role in ('super_admin','admin','editor')
  );
$$;


create or replace function public.is_admin_or_super_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_profiles p
    where p.id = auth.uid()
      and p.active = true
      and p.role in ('super_admin','admin')
  );
$$;


create or replace function public.is_super_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_profiles p
    where p.id = auth.uid()
      and p.active = true
      and p.role = 'super_admin'
  );
$$;


-- Remove earlier broad content policies; replace with role-scoped content policies.
do $$
declare t text;
begin
  foreach t in array array['programs','achievements','gallery_albums','gallery_photos','digital_works','announcements'] loop
    execute format('drop policy if exists "admins manage %s" on public.%I', t, t);
  end loop;
end $$;


-- Content editors can manage school content; only super_admin manages user profiles/settings.
create policy "content managers manage programs" on public.programs
  for all to authenticated using (public.is_content_manager()) with check (public.is_content_manager());
create policy "content managers manage achievements" on public.achievements
  for all to authenticated using (public.is_content_manager()) with check (public.is_content_manager());
create policy "content managers manage albums" on public.gallery_albums
  for all to authenticated using (public.is_content_manager()) with check (public.is_content_manager());
create policy "content managers manage photos" on public.gallery_photos
  for all to authenticated using (public.is_content_manager()) with check (public.is_content_manager());
create policy "content managers manage digital works" on public.digital_works
  for all to authenticated using (public.is_content_manager()) with check (public.is_content_manager());
create policy "content managers manage announcements" on public.announcements
  for all to authenticated using (public.is_content_manager()) with check (public.is_content_manager());

-- Replace the previous guestbook management policy. Content managers may moderate;
-- public submissions must later be routed through a server endpoint with Turnstile.
drop policy if exists "admins manage guestbook" on public.guestbook_entries;
create policy "content managers moderate guestbook" on public.guestbook_entries
  for all to authenticated using (public.is_content_manager()) with check (public.is_content_manager());

-- Restrict settings and profiles to super_admin; no broad admin/editor access.
drop policy if exists "admins read settings" on public.site_settings;
drop policy if exists "super admins manage settings" on public.site_settings;
create policy "super admins read settings" on public.site_settings
  for select to authenticated using (public.is_super_admin());
create policy "super admins manage settings" on public.site_settings
  for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());

-- Activity log is read-only from clients. Inserts should be performed by trusted server code/triggers.
drop policy if exists "admins read activity logs" on public.activity_logs;
create policy "super admins read activity logs" on public.activity_logs
  for select to authenticated using (public.is_super_admin());
revoke insert, update, delete on public.activity_logs from anon, authenticated;

-- Ensure no anonymous write access to content tables or private tables.
revoke insert, update, delete on public.programs from anon;
revoke insert, update, delete on public.achievements from anon;
revoke insert, update, delete on public.gallery_albums from anon;
revoke insert, update, delete on public.gallery_photos from anon;
revoke insert, update, delete on public.digital_works from anon;
revoke insert, update, delete on public.announcements from anon;
revoke all on public.user_profiles from anon;
revoke all on public.site_settings from anon;
revoke all on public.activity_logs from anon;
