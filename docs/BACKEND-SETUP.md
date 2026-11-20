# Backend setup plan — SMPN 7 Katingan Hilir

Frontend baseline: V13. Backend target: Supabase PostgreSQL + Supabase Auth + Storage + RLS, Cloudflare DNS/CDN/WAF/Rate Limiting and Turnstile.

## This package contains
- `supabase/migrations/202611200001_initial_schema.sql`: initial schema for profiles, programs, achievements, albums/photos, digital works, announcements, guestbook, settings and activity logs. RLS policies are included.
- `supabase/functions/README.md`: planned Edge Functions for guestbook and audit logging.
- Frontend is not connected to live Supabase yet; credentials are not included.

## Supabase project setup
1. Create a Supabase project under your own account; choose a region appropriate for the school and expected users.
2. In SQL Editor, inspect and run the migration SQL.
3. In Authentication, configure allowed email sign-in and recovery options. Create the first admin user.
4. Insert a `user_profiles` row for that Auth user and assign `super_admin` only to the principal's account. Do this using trusted SQL/editor access.
5. Create Storage buckets (planned): `school-public-media` (public read for approved media) and `admin-private` (private files). Storage policies will be designed before uploads are wired in.
6. Never place the Supabase secret/service-role key in browser files. Frontend may use publishable key only with correct RLS.
7. Test policies for anonymous and authenticated users before publishing.

## Cloudflare security
1. Add the website domain to Cloudflare and configure DNS to the actual hosting provider when chosen.
2. Enable SSL/TLS Full (strict) only after origin certificate/SSL is configured correctly.
3. Enable baseline WAF managed rules and sensible rate limits for login and form endpoints.
4. Configure Cloudflare Turnstile for guestbook and other public forms. The secret key must be validated server-side by an Edge Function or trusted backend; never accept a client-only token check.
5. Keep DNS/origin settings and admin access restricted; use MFA for accounts where available.
6. Do not claim WAF/Turnstile are active until the domain is connected and dashboard settings are configured.

## API exposure/security
- Supabase Data API uses PostgREST. Exposed tables require RLS and least-privilege grants.
- Public select access is only for published rows.
- Guestbook public insert is denied in this migration and will be enabled only through a Turnstile-verified server function.
- Service/secret keys are server-side only.
- Verify policies with automated tests before production.
