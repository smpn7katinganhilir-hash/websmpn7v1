-- Allow anonymous visitors to submit guestbook messages only as pending.
GRANT INSERT ON public.guestbook_entries TO anon;

DROP POLICY IF EXISTS "public submit guestbook pending" ON public.guestbook_entries;
CREATE POLICY "public submit guestbook pending"
ON public.guestbook_entries
FOR INSERT
TO anon
WITH CHECK (moderation_status = 'pending');
