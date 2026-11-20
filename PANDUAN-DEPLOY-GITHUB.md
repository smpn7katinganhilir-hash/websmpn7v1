# Panduan Deploy Website SMP Negeri 7 Katingan Hilir ke GitHub Pages

## Kenapa logo & foto hero sebelumnya tidak muncul
Semua gambar sekolah ada di folder `assets/images/`:

| File | Dipakai untuk |
|---|---|
| `logo-sekolah.jpeg` | Logo di header & footer semua halaman |
| `warga-sekolah.jpg` | Foto hero Beranda, Profil, Galeri (+ cadangan hero halaman lain) |
| `kepala-sekolah.png` | Foto sambutan Kepala Sekolah |

Kalau folder `assets/` tidak ikut ter-upload ke GitHub, halaman tetap tampil
tapi semua gambar kosong (logo jadi kotak bertuliskan "Logo", hero jadi biru polos).

## Yang sudah diperbaiki di versi ini
1. Struktur zip dibuat **rata**: `index.html` langsung di root, tanpa folder pembungkus.
2. Folder `New folder/` (salinan lama yang tidak dipakai) dihapus.
3. Logo asli sekolah dipasang di header & footer **semua halaman**
   (sebelumnya hanya kotak angka "7", kecuali header Beranda dan Login).
4. Link foto hero halaman **Informasi/Pengumuman** yang rusak (ID foto terpotong) diperbaiki.
5. Semua hero halaman yang memakai foto Unsplash diberi **foto cadangan lokal**
   (`warga-sekolah.jpg`), jadi kalau foto internet gagal dimuat, hero tidak kosong.
6. Gambar galeri bawaan (Unsplash) juga diberi cadangan lokal kalau gagal dimuat.
7. Ditambahkan file `.nojekyll` supaya GitHub Pages menyajikan file apa adanya.

Teks, warna, tata letak, dan fitur lain **tidak diubah**.

## Cara upload lewat web GitHub (tanpa aplikasi tambahan)
1. Ekstrak zip ini di laptop.
2. Buka repo di github.com, lalu klik **Add file → Upload files**.
3. Buka folder hasil ekstrak, **pilih SEMUA isinya** (termasuk folder `assets`, `docs`, `supabase`),
   lalu **drag** ke kotak upload. Jangan pakai tombol "choose your files", karena tombol itu tidak bisa membawa folder.
4. Klik **Commit changes**.
5. Masuk **Settings → Pages**. Di bagian *Build and deployment*, pilih
   **Deploy from a branch**, lalu branch `main` dan folder `/ (root)`, lalu **Save**.
6. Tunggu 1–2 menit. Situs akan tersedia di `https://<username>.github.io/<nama-repo>/`.
7. Buka situsnya dengan **Ctrl + Shift + R** supaya tidak memakai cache lama.

## Cek setelah deploy
- Di halaman utama repo harus ada folder `assets` → `images` berisi 3 file di atas.
- Nama file **peka huruf besar/kecil** di GitHub: `logo-sekolah.jpeg` ≠ `Logo-Sekolah.jpeg`.
  Kalau mengganti gambar, pakai nama yang persis sama.

## Catatan
- Repo harus **publik** untuk GitHub Pages gratis. Kode sudah dicek: tidak ada kunci rahasia
  (service role) Supabase. `supabase-config.js` hanya berisi URL project & kunci publik.
- Jangan pernah upload file `.env` (sudah diabaikan oleh `.gitignore`).
- Mencoba di laptop tanpa internet: buka terminal di folder ini, jalankan
  `python -m http.server 8000`, lalu buka `http://localhost:8000`.
