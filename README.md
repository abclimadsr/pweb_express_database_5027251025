# Manajemen Produk: React + Express + Prisma + PostgreSQL (Neon)

Tugas Pemrograman Web Week 13 (React Router dan Tailwind CSS).
Melanjutkan aplikasi Manajemen Produk Week 12 dengan menambahkan navigasi antarhalaman memakai React Router, halaman detail produk, halaman 404, dan penataan tampilan memakai Tailwind CSS. Frontend terintegrasi dengan API Express dari Week 10.

- Nama: Tafidah Hasna Mumtazah
- NRP: 5027251025

## Deskripsi Tugas

Aplikasi **Manajemen Produk** berbasis React yang terhubung ke API Express. Fitur tambah, lihat, edit, dan hapus produk tetap berfungsi setelah penambahan routing dan styling, dan seluruh data berasal dari backend.

### Halaman dan Route

| URL | Halaman | Keterangan |
|---|---|---|
| `/` | Redirect | Diarahkan ke `/products` |
| `/products` | Daftar Produk | Pencarian, jumlah produk, kartu produk, tombol Tambah/Detail/Edit/Hapus |
| `/products/:id` | Detail Produk | Menampilkan data produk sesuai `id` pada URL, `Link` kembali ke daftar, dan pesan jika produk tidak ditemukan |
| `*` | 404 | Pesan halaman tidak ditemukan dengan tautan ke halaman utama dan daftar produk |

Seluruh halaman memakai layout bersama (`PageLayout`) yang berisi navbar dan `Outlet`.

### Halaman Daftar Produk

- Judul, deskripsi singkat, dan tombol **+ Tambah Produk**.
- Kolom pencarian berdasarkan nama produk.
- Jumlah produk (contoh: `3 produk`).
- Daftar produk dalam bentuk kartu: ID, nama, harga berformat Rupiah, serta tombol **Detail**, **Edit**, dan **Hapus**.
- Keterangan jumlah, contoh: `Menampilkan 3 dari 3 produk`.
- Status memuat data dan pesan galat jika data gagal dimuat dari server.

### Halaman Detail Produk

- Data diambil dari backend (`GET /products/:id`) berdasarkan parameter `id` pada URL.
- Menampilkan ID, nama, dan harga produk.
- Tautan **Kembali ke daftar produk**.
- Jika backend mengembalikan 404, tampil pesan "Produk tidak ditemukan" beserta ID yang dicari. Jika server gagal dihubungi, tampil pesan galat.

### Pop-up (Modal)

| Pop-up | Fungsi |
|---|---|
| Tambah Produk | Form nama dan harga produk baru, dengan validasi harga harus lebih dari 0 |
| Edit Produk | Mengubah nama dan harga produk yang dipilih |
| Hapus Produk? | Konfirmasi sebelum produk dihapus permanen |

### Tampilan (Tailwind CSS)

Navbar, daftar produk, formulir, modal, halaman detail, dan halaman 404 ditata dengan Tailwind CSS. Tata letak responsif: grid produk satu kolom di layar kecil, dua kolom di layar sedang (`sm`), dan tiga kolom di layar besar (`lg`).

## Teknologi

| Komponen | Keterangan |
|---|---|
| Frontend | React 19 + Vite (port 5173) |
| Routing | React Router 7 (`react-router`) |
| Styling | Tailwind CSS v4 (`@tailwindcss/postcss`) |
| Backend | Node.js + Express + TypeScript (port 3000) |
| ORM | Prisma 7.10.0 + driver adapter `@prisma/adapter-pg` |
| Database | PostgreSQL di Neon (cloud) |
| Database viewer | Prisma Studio (port 51212) |

## Struktur Proyek

```
prisma/
  schema.prisma          # model Product
  migrations/            # riwayat migration
prisma.config.ts         # konfigurasi CLI Prisma (memakai DIRECT_URL)
src/                     # backend Express (dari Week 10)
  index.ts
  app.ts
  lib/prisma.ts
  middleware/request-logger.ts
  routes/product.routes.ts
  controllers/product.controller.ts
frontend/                # aplikasi React + Vite
  vite.config.js         # proxy /api -> backend
  postcss.config.mjs     # plugin Tailwind
  src/
    main.jsx             # entry point + BrowserRouter
    App.jsx              # peta route
    index.css            # import Tailwind
    services/
      productApi.js      # pemanggilan API produk
    components/          # struktur atomic design
      molecules/         # ProductCard
      organisms/         # Navbar, ProductFormModal, DeleteModal
      templates/         # PageLayout (Navbar + Outlet)
      pages/             # ProductsPage, ProductDetailPage, NotFoundPage
    utils/
      formatPrice.js
```

## Instalasi dan Menjalankan

1. Clone repository, lalu masuk ke foldernya.
2. Install dependensi backend dan frontend:
   ```bash
   npm install
   cd frontend
   npm install
   cd ..
   ```
3. Buat file `.env` di root proyek, lalu isi dengan connection string dari Neon:
   ```
   DATABASE_URL="postgresql://USER:PASSWORD@HOST-pooler/DBNAME?sslmode=require"
   DIRECT_URL="postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require"
   PORT=3000
   ```
   - `DATABASE_URL`: koneksi pooler (host berakhiran `-pooler`), dipakai aplikasi saat berjalan.
   - `DIRECT_URL`: koneksi langsung (tanpa `-pooler`), dipakai Prisma CLI untuk migration.
4. Terapkan migration ke database:
   ```bash
   npx prisma migrate deploy
   ```
5. Generate Prisma Client:
   ```bash
   npx prisma generate
   ```
6. Jalankan backend (terminal 1, di root proyek):
   ```bash
   npm run dev
   ```
   Backend berjalan di http://localhost:3000
7. Jalankan frontend (terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend berjalan di http://localhost:5173
8. (Opsional) Lihat isi database (terminal 3, di root proyek):
   ```bash
   npx prisma studio
   ```
   Prisma Studio berjalan di http://localhost:51212

Catatan: backend harus berjalan lebih dulu. Jika tidak, frontend menampilkan pesan "Gagal memuat produk. Pastikan server Express menyala."

### Pengecekan kualitas kode (opsional)

```bash
cd frontend
npm run lint
npm run build
```

## Proxy `/api`

Frontend memanggil backend lewat prefix `/api`. Vite meneruskan request tersebut ke Express dan menghapus prefix-nya:

```
/api/products  ->  http://localhost:3000/products
```

Prefix ini diperlukan karena `/products` dan `/products/:id` sekarang juga merupakan alamat halaman frontend. Tanpa prefix, membuka atau me-refresh `/products/1` langsung akan diteruskan ke Express dan menampilkan JSON, bukan halaman React. Backend tidak diubah.

## Model Data

```prisma
model Product {
  id    Int    @id @default(autoincrement())
  name  String
  price Int
}
```

`id` dibuat otomatis oleh database dan tidak dipakai ulang setelah produk dihapus, sehingga satu ID selalu merujuk ke satu produk. Karena itu urutan ID di daftar bisa memiliki celah (contoh: 1, 2, 4, 5). `price` adalah rupiah bulat.

## Endpoint yang Dipakai Frontend

| Aksi di UI | Method | URL frontend | URL backend | Body |
|---|---|---|---|---|
| Memuat daftar produk | GET | `/api/products` | `/products` | - |
| Memuat detail produk | GET | `/api/products/:id` | `/products/:id` | - |
| Simpan Produk (tambah) | POST | `/api/products` | `/products` | `{ "name": "Pulpen", "price": 5000 }` |
| Simpan Perubahan (edit) | PUT | `/api/products` | `/products` | `{ "id": 1, "name": "Pensil", "price": 3000 }` |
| Hapus Produk | DELETE | `/api/products/:id` | `/products/:id` | - |

Respons galat dari backend untuk `GET /products/:id`:

| Kondisi | Status | Body |
|---|---|---|
| Produk tidak ada | 404 | `{"message":"Produk tidak ditemukan"}` |
| ID bukan angka positif | 400 | `{"message":"ID tidak valid"}` |

Status 404 dipakai halaman detail untuk menampilkan pesan produk tidak ditemukan.

## Skenario Pengujian

Diuji manual di browser, dengan verifikasi ke endpoint API. Bukti berupa screenshot dilampirkan pada deskripsi Pull Request.

| No | Skenario | Langkah | Hasil yang diharapkan | Hasil aktual | Status |
|---|---|---|---|---|---|
| 1 | Menampilkan daftar produk | Buka `localhost:5173/products` | Produk dari database tampil sebagai kartu dengan tombol Detail, Edit, Hapus | Muncul 4 kartu (ID 1, 2, 4, 5), tertulis `4 produk` dan `Menampilkan 4 dari 4 produk` | Berhasil |
| 2 | Pop-up konfirmasi hapus | Klik **Hapus** pada ID 4 (Buku) | Modal konfirmasi berisi detail produk | Modal "Hapus Produk?" tampil dengan detail ID 4, Buku, Rp5.000 | Berhasil |
| 3 | Hapus produk | Klik **Hapus Produk** pada modal | Produk hilang dari daftar dan database | Kartu Buku hilang, jumlah menjadi `3 produk` | Berhasil |
| 4 | Verifikasi hapus di API | Buka `localhost:3000/products/4` | Produk tidak ditemukan | `{"message":"Produk tidak ditemukan"}` | Berhasil |
| 5 | Halaman detail produk | Klik **Detail** pada ID 5 (Penggaris) | Halaman `/products/5` menampilkan data produk dan tautan kembali | Tampil ID 5, Penggaris, Rp2.500, dan tautan "Kembali ke daftar produk" | Berhasil |
| 6 | Endpoint detail di API | Buka `localhost:3000/products/5` | Mengembalikan data satu produk dalam JSON | `{"id":5,"name":"Penggaris","price":2500}` | Berhasil |
| 7 | Endpoint detail, ID tidak ada | Buka `localhost:3000/products/99999` | Status 404 dengan pesan | `{"message":"Produk tidak ditemukan"}`, status 404 | Berhasil |
| 8 | Detail produk tidak ditemukan di frontend | Buka `localhost:5173/products/99999` | Pesan "Produk tidak ditemukan" dan tautan kembali | Pesan "Produk tidak ditemukan" tampil beserta ID yang dicari dan tautan kembali ke daftar produk | Berhasil |
| 9 | Halaman 404 | Buka `localhost:5173/ngawur` | Pesan halaman tidak ditemukan dan tautan ke halaman utama dan daftar produk | Halaman 404 tampil dengan pesan "Halaman tidak ditemukan" serta tautan ke halaman utama dan daftar produk | Berhasil |
| 10 | Refresh di halaman detail | Buka `/products/5`, tekan refresh | Halaman detail tetap tampil (bukan JSON) | Halaman detail tetap tampil setelah di-refresh | Berhasil |
| 11 | Tambah produk | Klik **+ Tambah Produk**, isi nama dan harga valid, simpan | Produk baru muncul di daftar dan tersimpan di database | Produk baru muncul di daftar dan tetap ada setelah halaman dimuat ulang | Berhasil |
| 12 | Validasi harga | Isi harga kosong atau 0, simpan | Muncul pesan "Harga harus lebih dari 0." dan data tidak disimpan | Pesan "Harga harus lebih dari 0." tampil dan modal tetap terbuka | Berhasil |
| 13 | Edit produk | Klik **Edit**, ubah data, simpan | Data produk berubah di daftar dan database | Form terisi data lama; setelah disimpan, kartu menampilkan data baru dan tetap berubah setelah dimuat ulang | Berhasil |
| 14 | Navigasi Back dan Forward | Berpindah daftar, detail, lalu Back dan Forward browser | Halaman mengikuti riwayat navigasi | Tombol Back dan Forward browser berpindah halaman sesuai riwayat | Berhasil |
| 15 | Tampilan responsif | Perkecil lebar browser (±375px) | Grid menjadi satu kolom, tampilan tetap rapi | Grid menjadi satu kolom dan tampilan tetap rapi | Berhasil |
| 16 | Penanganan error saat backend mati | Matikan server Express, muat ulang frontend | Frontend menampilkan pesan galat | Muncul "Gagal memuat produk. Pastikan server Express menyala." | Berhasil |

Kesimpulan: semua fitur (tampil, cari, tambah, edit, hapus, detail, halaman 404, validasi input, dan penanganan error) berjalan sesuai harapan setelah penambahan routing dan Tailwind CSS.

## Perubahan dari Week 12

- Menambahkan **React Router** (`BrowserRouter`, `Routes`, `Route`, `NavLink`, `Link`, `useParams`) dengan layout bersama dan `Outlet`.
- Menambahkan **halaman detail produk** `/products/:id` dengan penanganan loading, galat, dan produk tidak ditemukan.
- Menambahkan **halaman 404** untuk URL yang tidak terdaftar.
- Menata seluruh tampilan dengan **Tailwind CSS v4** dan menghapus CSS bawaan (`App.css` dan isi `index.css` lama).
- Memindahkan isi `App.jsx` lama ke `pages/ProductsPage.jsx`; `App.jsx` kini hanya berisi peta route.
- Memisahkan pemanggilan API ke `services/productApi.js`.
- Merapikan struktur komponen dengan atomic design (`molecules`, `organisms`, `templates`, `pages`).
- Mengubah proxy Vite menjadi prefix `/api` agar URL halaman tidak bentrok dengan URL API.
- Backend (route, controller, Prisma) tidak berubah dan dipakai apa adanya. Endpoint `GET /products/:id` yang sebelumnya tidak dipakai kini dipakai oleh halaman detail.

## Catatan

- Terminal backend menampilkan peringatan `sslmode` dari `libpq` saat koneksi ke Neon. Ini hanya peringatan dan tidak memengaruhi fungsi aplikasi.
- Saat dijalankan di hosting produksi, server perlu mengarahkan semua URL ke `index.html` (fallback SPA) agar membuka `/products/:id` langsung tidak menghasilkan 404 dari server.