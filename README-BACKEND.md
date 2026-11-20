# Backend foundation (V22)

This package preserves the V21 frontend and adds a Supabase/PostgreSQL security-hardening migration and updated backend notes.


## Migration order
1. `supabase/migrations/202611200001_initial_schema.sql`
2. `supabase/migrations/202611200002_security_hardening.sql`

Read `docs/BACKEND-ROADMAP-AND-SECURITY.md` before applying migrations. The frontend is not yet wired to the database. Supabase publishable/anon keys may be used in frontend only after RLS is reviewed and enabled; never expose service-role keys.

## V22.1 working update
- Admin announcements are now connected to the `public.announcements` table (create/edit/delete and publish/unpublish).
- Homepage and announcements page read published announcements from Supabase, with demo fallback content when no published rows exist or the connection fails.
- The guestbook is still local prototype storage; public submissions are not connected to Supabase because the planned validated server/Edge Function + Turnstile endpoint has not been built yet.
- Before using announcement CRUD, apply `supabase/migrations/202611200003_api_grants.sql` in Supabase SQL Editor. It grants API table privileges while leaving row access controlled by RLS.
- This update has been syntax-checked locally, but not live-tested against the user's Supabase project or deployed hosting.
