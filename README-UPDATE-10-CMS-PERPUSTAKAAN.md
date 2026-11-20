# Update 10 — CMS Perpustakaan Digital

## Perbaikan
- Kartu Perpustakaan pada dashboard modul Admin menjadi dapat diklik/diakses keyboard dan membuka tab CMS Perpustakaan.
- Menambahkan tab CMS `digital_works` ke modul CMS.
- Form Perpustakaan: judul, penulis, kategori, sinopsis, URL cover, URL flipbook, tahun terbit, karya unggulan, urutan, dan status draft/published/archived.
- CRUD: tambah, edit, ubah status terbit/tarik, hapus.
- Halaman publik Perpustakaan membaca karya `published` dari Supabase, dengan pencarian judul/penulis/kategori/sinopsis.
- Katalog lama tetap menjadi fallback jika data Supabase kosong atau query gagal.
- Skrip perpustakaan kini memuat Supabase CDN dan config dengan urutan defer yang tepat.

## Pemeriksaan lokal
- `cms-admin.js` lolos `node --check`.
- `perpustakaan.js` lolos `node --check`.
- ZIP diuji integritas.

## Belum diverifikasi
- Pengujian browser langsung dan koneksi Supabase produksi.
- Upload file cover (saat ini cover memakai URL).
- Deploy hosting.
