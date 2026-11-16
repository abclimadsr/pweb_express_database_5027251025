# Manajemen Produk: React + Express + Prisma + PostgreSQL (Neon)

Tugas Pemrograman Web Week 12 (Fundamental React).
Melanjutkan API produk Week 10 (Express + Prisma), dengan tambahan antarmuka web berbasis React untuk mengelola produk.

- Nama: Tafidah Hasna Mumtazah
- NRP: 5027251025

## Deskripsi Tugas

Membuat halaman **Manajemen Produk** dengan React yang terhubung ke API Express dari Week 10. Konsep React yang dipakai: komponen, JSX, props, state (`useState`), event handling, conditional rendering, serta list dengan `map()` dan `key`.

### Halaman Utama

- Judul, deskripsi singkat, dan tombol **+ Tambah Produk**.
- Kolom pencarian berdasarkan nama produk.
- Jumlah produk (contoh: `3 produk`).
- Daftar produk dalam bentuk kartu: ID, nama, harga berformat Rupiah, serta tombol **Edit** dan **Hapus**.
- Keterangan jumlah, contoh: `Menampilkan 3 dari 3 produk`.
- Pesan galat jika data gagal dimuat dari server.

### Pop-up (Modal)

| Pop-up | Fungsi |
|---|---|
| Tambah Produk | Form nama dan harga produk baru, dengan validasi harga harus lebih dari 0 |
| Edit Produk | Mengubah nama dan harga produk yang dipilih |
| Hapus Produk? | Konfirmasi sebelum produk dihapus permanen |

## Teknologi

| Komponen | Keterangan |
|---|---|
| Frontend | React + Vite (port 5173) |
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
frontend/                # aplikasi React + Vite (baru di Week 12)
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
3. Salin `.env.example` menjadi `.env`, lalu isi dengan connection string dari Neon:
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

## Model Data

```prisma
model Product {
  id    Int    @id @default(autoincrement())
  name  String
  price Int
}
```

`id` dibuat otomatis oleh database. `price` adalah rupiah bulat.

## Endpoint yang Dipakai Frontend

| Aksi di UI | Method | URL | Body |
|---|---|---|---|
| Memuat daftar produk | GET | `/products` | - |
| Simpan Produk (tambah) | POST | `/products` | `{ "name": "Pulpen", "price": 5000 }` |
| Simpan Perubahan (edit) | PUT | `/products` | `{ "id": 1, "name": "Pensil", "price": 3000 }` |
| Hapus Produk | DELETE | `/products/:id` | - |

Endpoint `GET /products/:id` tersedia di backend, tetapi tidak dipakai oleh halaman ini.

## Skenario Pengujian

Diuji manual di browser, dengan verifikasi ke endpoint API, Prisma Studio, dan log terminal backend. Bukti berupa screenshot ada di folder `Dokumentasi Bukti`.

| No | Skenario | Langkah | Hasil yang diharapkan | Hasil aktual | Status |
|---|---|---|---|---|---|
| 1 | Menampilkan daftar produk awal | Buka `localhost:5173` | Produk dari database tampil sebagai kartu | Muncul 2 kartu (ID 1 dan 2: Spidol, Rp8.000), tertulis `2 produk` dan `Menampilkan 2 dari 2 produk` | Berhasil |
| 2 | Endpoint GET API | Buka `localhost:3000/products` | Mengembalikan data produk dalam JSON | `[{"id":1,"name":"Spidol","price":8000},{"id":2,"name":"Spidol","price":8000}]` | Berhasil |
| 3 | Data awal di database | Buka tabel `Product` di Prisma Studio | Sesuai dengan data di aplikasi | 2 baris: id 1 dan 2, Spidol, 8000 | Berhasil |
| 4 | Pencarian produk | Ketik `spidol` di kolom pencarian | Produk yang namanya cocok tampil | Kedua produk Spidol tampil (`Menampilkan 2 dari 2 produk`), huruf kecil tetap terdeteksi | Berhasil |
| 5 | Membuka pop-up Tambah Produk | Klik **+ Tambah Produk** | Modal berisi form kosong dengan placeholder dan latar redup | Modal "Tambah Produk" muncul dengan placeholder `Contoh: Pulpen` dan `Contoh: 5000`, serta tombol Batal dan Simpan Produk | Berhasil |
| 6 | Tambah produk (data valid) | Isi nama `Pulpen`, harga `5000`, klik **Simpan Produk** | Produk baru masuk ke daftar dan database | Kartu baru ID 3 Pulpen Rp5.000 muncul, jumlah menjadi `3 produk`; log backend mencatat `POST /products` | Berhasil |
| 7 | Verifikasi data tambah di database | Refresh Prisma Studio | Baris baru tersimpan | Baris id 3, Pulpen, 5000 ada di tabel | Berhasil |
| 8 | Validasi harga kosong | Isi nama `Penggatis`, kosongkan harga, klik **Simpan Produk** | Muncul pesan error dan data tidak disimpan | Muncul pesan merah "Harga harus lebih dari 0." dan modal tetap terbuka | Berhasil |
| 9 | Edit produk | Klik **Edit** pada ID 1, ubah menjadi `Pensil` dengan harga `3000`, klik **Simpan Perubahan** | Data produk ID 1 berubah | Form terisi data lama dan menampilkan `ID: 1`. Setelah disimpan, kartu menjadi Pensil Rp3.000; log mencatat `PUT /products` | Berhasil |
| 10 | Verifikasi data edit di database | Refresh Prisma Studio | Baris id 1 terupdate | Baris id 1 berubah menjadi Pensil, 3000 | Berhasil |
| 11 | Pop-up konfirmasi hapus | Klik **Hapus** pada ID 3 (Pulpen) | Modal konfirmasi berisi detail produk | Modal "Hapus Produk?" menampilkan peringatan "tidak dapat dikembalikan" dan detail ID 3 Pulpen Rp5.000 | Berhasil |
| 12 | Hapus produk | Klik **Hapus Produk** pada modal | Produk hilang dari daftar dan database | Kartu Pulpen hilang, jumlah menjadi `2 produk`; log mencatat `DELETE /products/3` | Berhasil |
| 13 | Verifikasi data hapus di database | Refresh Prisma Studio | Baris id 3 terhapus | Tersisa 2 baris: Pensil (3000) dan Spidol (8000) | Berhasil |
| 14 | Penanganan error saat backend mati | Matikan server Express, lalu muat ulang frontend | Frontend menampilkan pesan galat | Muncul "Gagal memuat produk. Pastikan server Express menyala.", `0 produk`, `Menampilkan 0 dari 0 produk` | Berhasil |
| 15 | Sinkronisasi frontend dan backend | Periksa log terminal backend setelah semua aksi | Setiap aksi tercatat sebagai request | Log: `GET`, `GET`, `POST`, `GET`, `PUT`, `GET`, `DELETE /products/3`, `GET` | Berhasil |

Kesimpulan: semua fitur utama (tampil, cari, tambah, edit, hapus, validasi input, dan penanganan error) berjalan sesuai harapan. Perubahan dari UI konsisten dengan data di API dan Prisma Studio.

## Perubahan dari Week 10

- Ditambahkan folder `frontend/` berisi aplikasi React + Vite.
- Halaman utama dengan daftar produk berbentuk kartu, pencarian, dan penghitung jumlah produk.
- Tiga pop-up: Tambah Produk, Edit Produk, dan Hapus Produk.
- Validasi harga di sisi frontend, ditambah penanganan error saat server tidak tersedia.
- Backend (route, controller, Prisma) tidak berubah dan dipakai apa adanya.

## Catatan

- Terminal backend menampilkan peringatan `sslmode` dari `libpq` saat koneksi ke Neon. Ini hanya peringatan dan tidak memengaruhi fungsi aplikasi.
