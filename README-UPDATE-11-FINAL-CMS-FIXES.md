# Update 11 — CMS Fixes & Final Testing Checklist

This package continues from Update 10. Existing working login, announcements, guestbook, programs, achievements, gallery, and digital library are preserved.

## Code fix
- Fixed gallery photo edit flow in `cms-admin.js`: editing a photo now reads/writes the form controls through explicit selectors rather than relying on a global/undefined `panel` reference.
- Photo form now reliably switches between Save Photo and Update Photo labels, and resets to add mode after save/cancel.

## Admin test sequence
1. Login to Admin.
2. Test Programs: create a draft, edit, publish, confirm public page, unpublish, delete test entry.
3. Test Achievements: create, edit, publish, confirm public page, unpublish, delete test entry.
4. Test Gallery: create album, publish album, manage photos (add, edit caption/URL/order, delete), confirm public gallery, delete test album.
5. Test Library: create work with title, author, category, synopsis, cover URL (optional), flipbook URL, year, featured, order, status; edit, publish, confirm public catalog, unpublish and delete test work.
6. Test Announcements and Guestbook regression: verify existing functions still work.
7. Check mobile and desktop layout, browser console, and Network errors.

## Deployment checklist
- [ ] Use a backup before replacing the website folder.
- [ ] Confirm Supabase URL and publishable key in `supabase-config.js`.
- [ ] Confirm all required table grants and RLS policies have been applied.
- [ ] Verify login and every CMS CRUD function in the browser.
- [ ] Verify published-only visibility on public pages.
- [ ] Verify image links and flipbook links.
- [ ] Verify guestbook moderation.
- [ ] Verify responsive layout on mobile.
- [ ] Deploy to hosting and test the live domain.

## Limits
- Gallery and library image covers currently use public image URLs; direct upload via Supabase Storage is not included in this update.
- Browser tests against production Supabase and deployment are not performed from this package build environment.
