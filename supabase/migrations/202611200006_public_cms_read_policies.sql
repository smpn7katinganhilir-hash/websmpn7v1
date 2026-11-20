-- Public website read policies for published CMS content.
-- Apply after 202611200002_security_hardening.sql and 202611200003_api_grants.sql.
DROP POLICY IF EXISTS "public read published programs" ON public.programs;
CREATE POLICY "public read published programs" ON public.programs
  FOR SELECT TO anon, authenticated USING (status = 'published');
DROP POLICY IF EXISTS "public read published achievements" ON public.achievements;
CREATE POLICY "public read published achievements" ON public.achievements
  FOR SELECT TO anon, authenticated USING (status = 'published');
DROP POLICY IF EXISTS "public read published albums" ON public.gallery_albums;
CREATE POLICY "public read published albums" ON public.gallery_albums
  FOR SELECT TO anon, authenticated USING (status = 'published');
DROP POLICY IF EXISTS "public read photos in published albums" ON public.gallery_photos;
CREATE POLICY "public read photos in published albums" ON public.gallery_photos
  FOR SELECT TO anon, authenticated USING (
    EXISTS (SELECT 1 FROM public.gallery_albums a WHERE a.id = gallery_photos.album_id AND a.status = 'published')
  );
