-- API grants for the SMPN 7 website. Row access remains restricted by RLS.
-- Apply after the initial schema and security-hardening migrations.
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Public website can read rows, with RLS restricting results to published content.
GRANT SELECT ON public.programs, public.achievements, public.gallery_albums,
  public.gallery_photos, public.digital_works, public.announcements TO anon, authenticated;
-- Authenticated content managers can perform CRUD; RLS policies decide which rows/roles.
GRANT INSERT, UPDATE, DELETE ON public.programs, public.achievements, public.gallery_albums,
  public.gallery_photos, public.digital_works, public.announcements, public.guestbook_entries TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.guestbook_entries TO authenticated;
-- Profile reads are needed by login; profile changes remain protected by super-admin RLS.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_profiles TO authenticated;
GRANT SELECT ON public.site_settings, public.activity_logs TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
-- Public anonymous guestbook submission intentionally remains disabled until a validated server endpoint is deployed.
REVOKE INSERT, UPDATE, DELETE ON public.guestbook_entries FROM anon;
REVOKE ALL ON public.user_profiles, public.site_settings, public.activity_logs FROM anon;
