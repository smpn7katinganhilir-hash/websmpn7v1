# Panduan Website SMPN 7 Katingan Hilir — Versi 6 Tema

Isi zip ini adalah **seluruh isi repo** `websmpn7v1` yang sudah diperbarui. Tinggal ganti isi repo lama dengan isi zip ini, lalu web di **smpn7katinganhilir.sch.id** ikut berubah....

---

## 1. Yang berubah

| Bagian | Keterangan |
|---|---|
| Tampilan | 9 halaman didesain ulang, ada **6 gaya** yang bisa dipilih pengunjung lewat tombol **Tema** di pojok kanan atas |
| Gaya bawaan | **Klasik Modern**, warna Navy Emas (tampil saat pertama kali masuk) |
| Menu | Beranda · Profil ▾ · Kegiatan ▾ · Perpustakaan · Informasi ▾ · Kontak, plus tombol Buku Tamu |
| Logo tab browser | Bola dunia diganti **logo SMPN 7** (favicon.ico, favicon-32.png, favicon-192.png, apple-touch-icon.png) |
| Ekskul | Pramuka sekarang pakai deskripsi lengkap, kalimat "akan segera ditambahkan" sudah dihapus |
| Kontak & peta | Peta Google satelit + nama tempat (zoom 15) di koordinat sekolah, warnanya ikut tema, tombol "Petunjuk arah" di kanan atas. Citra satelit Google di titik sekolah memang beresolusi rendah, jadi zoom lebih dekat justru buram |
| Login Admin | Tombol **🔒 Login Admin** di bar atas (laptop) dan di menu ☰ (HP), juga di footer. Mengarah ke `admin.html`; kalau belum login otomatis dibawa ke `login.html` |
| WhatsApp | Tombol mengambang ke 0852-4922-9287 di semua halaman |
| Jalan Cerita | Dihapus, tidak diganti |

### 6 gaya tampilan
1. **Klasik Modern** (bawaan): hero carousel 8 slide (Beranda + 7 program). Punya 5 pilihan warna: Navy Emas, Hijau Sage, Biru Langit, Merah Borneo, Mode Gelap
2. **Album Kenangan**: hijau toska, foto berbingkai putih miring
3. **Buku Catatan Retro**: kertas bergaris, sticky note, polaroid
4. **Poster Sinematik**: gelap, judul raksasa "SMPN 7"
5. **Scrapbook Petualangan**: kertas kraft, tiket, selotip
6. **Pilar Warna**: langit cerah, 7 pilar warna untuk 7 program

Pilihan pengunjung disimpan di browser mereka sendiri (localStorage), jadi tidak memengaruhi pengunjung lain.

### Yang TIDAK berubah (logika asli tetap jalan)
- Supabase, login admin, `admin.html`, CMS (pengumuman, program, prestasi, galeri, perpustakaan, buku tamu)
- Semua file JS asli: `app.js`, `portal.js`, `cms-public.js`, `cms-admin.js`, `cms-modules.js`, `galeri.js`, `perpustakaan.js`, `auth.js`, `admin.js`, `supabase-config.js`
- `CNAME`, `.nojekyll`, folder `docs/` dan `supabase/`
- `style.css` lama tetap ada karena masih dipakai `login.html` dan `admin.html`

### Perbaikan bug lama
Di versi lama, halaman **Pengumuman** dan **Buku Tamu** memuat `app.js` dan `portal.js` sekaligus. Dua file itu sama-sama punya variabel `guestForm`, akibatnya `portal.js` error dan **form buku tamu serta daftar pengumuman tidak jalan**. Sekarang kedua halaman itu cukup memuat `portal.js`, jadi sudah normal.

---

## 2. Cara deploy (ganti isi repo)

1. Download repo lama sebagai cadangan dulu (GitHub → **Code → Download ZIP**)....
2. Ekstrak zip baru ini di laptop.
3. Buka repo `smpn7katinganhilir-hash/websmpn7v1` di GitHub.
4. Cara paling mudah lewat **GitHub Desktop**:
   - Clone repo → hapus semua file lama di folder lokal (kecuali folder `.git`)
   - Salin semua isi zip ke folder itu → **Commit** → **Push**
5. Kalau lewat web GitHub: **Add file → Upload files**, seret semua isi zip (termasuk folder `assets`), lalu Commit. File yang namanya sama akan tertimpa otomatis.
6. Tunggu 1–3 menit, lalu buka **smpn7katinganhilir.sch.id** dan tekan **Ctrl + F5** supaya cache lama hilang.

> Pastikan file `CNAME` tetap ada, isinya `smpn7katinganhilir.sch.id`. Kalau file ini hilang, domain resmi akan lepas.
> Jangan pernah upload file `.env` (yang ada di zip hanya `.env.example`, aman).

### Cek setelah deploy
- [ ] Beranda tampil gaya Klasik, carousel berganti tiap 7 detik
- [ ] Tombol **Tema** bisa mengganti 6 gaya, dan pilihannya tetap saat pindah halaman
- [ ] Logo SMPN 7 tampil di tab browser (kalau masih bola dunia, tutup lalu buka lagi browsernya; cache favicon memang bandel....)
- [ ] Pengumuman, Program, Prestasi, Galeri, Perpustakaan terisi dari Supabase
- [ ] Form Buku Tamu bisa kirim, lalu pesan muncul di admin untuk dimoderasi
- [ ] Menu HP (tombol ☰) bisa dibuka dan submenu bisa diklik
- [ ] Tombol **Login Admin** membuka halaman login, lalu setelah masuk langsung ke dashboard admin

---

## 3. Coba di laptop sebelum deploy

```bash
cd folder-hasil-ekstrak
python -m http.server 8000
```
Lalu buka `http://localhost:8000`. Jangan buka file HTML dengan klik dua kali (`file://`), karena Supabase dan peta tidak jalan dari situ.

---

## 4. Struktur file baru

```
assets/
  css/site.css       ← gaya dasar semua halaman (komponen, layout, responsif)
  css/themes.css     ← 6 gaya tampilan + 5 warna Klasik + hero Beranda per gaya
  js/theme.js        ← membaca pilihan tema (dipasang di <head> agar tidak berkedip)
  js/site.js         ← menu HP, submenu, panel tema, carousel Klasik, filter prestasi
  images/            ← foto hero & program (.webp)
  images/galeri/     ← foto album galeri (.webp, maks 1400px)
favicon.ico, favicon-32.png, favicon-192.png, apple-touch-icon.png
```

---

## 5. Mengganti atau menambah foto

**Paling mudah, tanpa ngoding:** lewat halaman **Admin** (Galeri, Program, Prestasi). Data dari admin otomatis menimpa isi bawaan di halaman.

**Ganti foto bawaan (hero/program):** timpa file dengan **nama yang sama persis**, misalnya `assets/images/hero.webp` atau `assets/images/linmas.webp`. Ukuran sekitar 1400–1600 px lebar. Format `.webp` paling ringan (bisa konversi gratis di squoosh.app).

| File | Dipakai untuk |
|---|---|
| `hero.webp` | Foto utama Beranda (upacara/pramuka) |
| `warga-sekolah.webp` | Foto bersama warga sekolah |
| `kepala-sekolah.webp` | Foto Kepala Sekolah |
| `linmas`, `juara`, `future`, `nusa`, `flexible`, `icare`, `tumbuh` `.webp` | Foto 7 program unggulan |
| `belajar`, `peduli`, `berkarya` `.webp` | Kolase Beranda |

---

## 6. Halaman yang sengaja BELUM dibuat

Datanya belum ada, jadi tidak dibuat supaya tidak ada isi karangan:
- Struktur Organisasi
- Guru & Tendik
- Fasilitas
- Kalender Akademik
- Berita (sementara pakai Pengumuman)
- Info SPMB (ditunda)
- Akreditasi (dikosongkan)

Kalau datanya sudah siap, tinggal kabari, nanti dibuatkan halamannya dengan header, footer, dan tema yang sama.

---

## 7. Kalau ada masalah

| Gejala | Solusi |
|---|---|
| Tampilan berantakan / masih versi lama | Ctrl + F5, atau buka di mode samaran |
| Foto tidak muncul | Cek folder `assets/images` ikut ter-upload dan nama file persis sama (huruf kecil/besar berpengaruh) |
| Data pengumuman/galeri kosong | Cek `supabase-config.js` tidak berubah dan proyek Supabase aktif |
| Domain jadi `github.io` | File `CNAME` hilang, upload ulang |
| Peta tidak tampil | Butuh internet; peta dari Google Maps |
