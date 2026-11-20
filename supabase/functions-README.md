# Supabase Edge Functions planned

- `guestbook-submit`: verify Cloudflare Turnstile token server-side, validate/sanitize fields, enforce rate limits, then insert a pending guestbook row.
- `admin-audit`: server-side activity log helper for sensitive administrative actions.

Do not put Supabase `service_role`/secret keys or Cloudflare Turnstile secret in frontend code.
