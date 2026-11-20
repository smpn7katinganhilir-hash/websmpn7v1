# Backend roadmap and security notes — SMPN 7 Katingan Hilir

## Chosen stack
- Frontend: existing V13 design baseline (keep pages and CSS stable).
- Database/API: Supabase PostgreSQL + Supabase REST API.
- Authentication: Supabase Auth for staff accounts.
- Media: Supabase Storage (public read for published school media; staff upload/delete policies to be configured).
- Edge/server functions: required for guestbook submissions and operations needing secrets or anti-abuse checks.
- Edge protection: Cloudflare DNS, TLS, WAF, rate limiting and Turnstile (Turnstile must be validated server-side).

## Database migrations
1. `202611200001_initial_schema.sql` — initial tables and policies.
2. `202611200002_security_hardening.sql` — role helper and role-scoped policies.

Apply in order in Supabase SQL Editor after reviewing. Do not paste any secret/service-role key into frontend files or chat.

## Roles
- `super_admin`: manage profiles/users, settings and content; view activity logs.
- `admin`: manage school content and moderate guestbook.
- `editor`: manage school content and moderate guestbook. The current database policy treats admin/editor as content managers; a finer role split can be introduced later if desired.

## Public reads
Public visitors can select only rows whose status is `published`, subject to each table's policy. Published albums expose their photos. Published digital works expose catalog data and flipbook links.

## Guestbook
Anonymous inserts are deliberately not granted directly to tables. A future server endpoint/Edge Function must validate the input, verify Turnstile token, rate limit, then insert a pending entry. Public reads should show approved entries only when a public guestbook display is implemented.

## Storage
Buckets and Storage policies are not yet created in these migrations. Set up buckets after project creation and restrict uploads/deletes to authenticated content managers. Public read is only appropriate for assets intended to appear on the public website.

## Cloudflare
Cloudflare configuration is a deployment step: domain DNS, proxy, TLS mode, WAF, rate limits, and Turnstile. Turnstile secrets belong only in server/Edge Function environment secrets.

## Important current state
The SQL schema is a backend foundation; the website frontend is not yet connected to Supabase. Do not treat V22 as a live production site. Next milestone is Supabase project creation, applying migrations, creating the first super_admin securely, and testing public reads/authenticated CRUD.
