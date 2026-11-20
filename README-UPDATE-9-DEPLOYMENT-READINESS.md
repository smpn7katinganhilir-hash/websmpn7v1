# SMPN 7 Katingan Hilir — CMS Update 9

## Perbaikan yang dilakukan
- CMS Prestasi tidak lagi mengurutkan berdasarkan kolom `sort_order` yang tidak ada pada tabel `achievements`; daftar diurutkan berdasarkan `created_at`.
- Form Program, Prestasi, dan Album tetap mendukung tambah/edit/status/delete.
- CMS Galeri ditambahkan pengelolaan foto per album: tambah foto dengan URL publik, edit caption/URL/urutan, dan hapus foto.
- Filter kategori Prestasi pada halaman publik diaktifkan kembali setelah data CMS dirender.
- JavaScript utama diperiksa dengan `node --check`.

## Batasan yang masih ada
- Foto Galeri pada Update 9 masih menggunakan URL gambar publik; upload file langsung melalui Supabase Storage belum dibuat.
- CMS Perpustakaan Digital belum dibuat.
- CMS Profil, CMS Beranda, Site Settings, SEO, dashboard statistik lanjutan, dan Activity Log belum selesai.
- Integrasi langsung ke Supabase produksi belum dapat dites dari paket lokal ini.

## Checklist sebelum deploy
1. Backup file website versi saat ini dan database Supabase.
2. Upload isi folder website dari paket ini ke hosting.
3. Pastikan migration/policies CMS publik Update 8 sudah diterapkan (migration `202611200006_public_cms_read_policies.sql` termasuk paket).
4. Login Admin, coba tambah/edit/hapus Program, Prestasi, Album.
5. Terbitkan satu konten tes per modul; verifikasi tampil pada halaman publik; tarik publikasi dan pastikan tidak tampil.
6. Galeri: buka Kelola Foto, tambah URL foto, edit caption/urutan, hapus, dan cek halaman publik.
7. Verifikasi Buku Tamu dan Pengumuman tetap berfungsi.
8. Uji semua halaman pada desktop dan mobile, cek console browser.
9. Jangan menganggap siap deploy final sampai seluruh langkah di atas lulus.
