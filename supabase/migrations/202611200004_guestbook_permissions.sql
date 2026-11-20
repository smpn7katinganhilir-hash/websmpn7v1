-- Guestbook permissions: authenticated editors can moderate;
-- public visitors can read only approved messages.
GRANT SELECT ON public.guestbook_entries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.guestbook_entries TO authenticated;

DROP POLICY IF EXISTS "public read approved guestbook" ON public.guestbook_entries;
CREATE POLICY "public read approved guestbook"
ON public.guestbook_entries
FOR SELECT
TO anon
USING (moderation_status = 'approved');
