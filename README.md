# API Produk: Express + Prisma + PostgreSQL (Neon)

Tugas Pemrograman Web Week 10 (PostgreSQL & Prisma).
Melanjutkan API produk Week 9 (Express), dengan data yang kini disimpan di PostgreSQL lewat Prisma ORM.

- Nama: Tafidah Hasna Mumtazah
- NRP: 5027251025

## Teknologi

| Komponen | Keterangan |
|---|---|
| Runtime | Node.js (LTS) |
| Framework | Express |
| Bahasa | TypeScript (dijalankan dengan `tsx`) |
| ORM | Prisma 7.10.0 + driver adapter `@prisma/adapter-pg` |
| Database | PostgreSQL di Neon (cloud) |

## Struktur Proyek

```
prisma/
  schema.prisma          # model Product
  migrations/            # riwayat migration
prisma.config.ts         # konfigurasi CLI Prisma (memakai DIRECT_URL)
src/
  index.ts               # menyalakan server (app.listen)
  app.ts                 # merangkai middleware dan router
  lib/prisma.ts          # PrismaClient (memakai DATABASE_URL)
  middleware/
    request-logger.ts    # mencatat setiap request
  routes/
    product.routes.ts    # method + path -> controller
  controllers/
    product.controller.ts # validasi, akses database, response
```

## Instalasi dan Menjalankan

1. Clone repository, lalu masuk ke foldernya.
2. Install dependensi:
   ```bash
   npm install
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
6. Jalankan server:
   ```bash
   npm run dev
   ```
   Server berjalan di http://localhost:3000

Melihat isi database:

```bash
npx prisma studio
```

Catatan: pada pengembangan awal (membuat migration baru) dipakai `npx prisma migrate dev --name <nama>`.
Pastikan versi `prisma` dan `@prisma/client` sama-sama 7.10.0.

## Model Data

```prisma
model Product {
  id    Int    @id @default(autoincrement())
  name  String
  price Int
}
```

`id` dibuat otomatis oleh database. `price` adalah rupiah bulat.

## Daftar Endpoint

| Method | URL | Body | Keterangan |
|---|---|---|---|
| GET | `/products` | - | Menampilkan seluruh produk |
| GET | `/products/:id` | - | Menampilkan satu produk |
| POST | `/products` | `{ "name": "Spidol", "price": 8000 }` | Membuat produk baru |
| PUT | `/products` | `{ "id": 1, "name": "Spidol Biru", "price": 9000 }` | Mengubah produk yang sudah ada |
| DELETE | `/products/:id` | - | Menghapus produk berdasarkan id |

### Aturan validasi

- `name`: string, tidak boleh kosong.
- `price`: bilangan bulat, minimal 0.
- `id` (pada path atau body PUT): bilangan bulat positif.

### Status response

| Status | Kondisi |
|---|---|
| 200 | GET, PUT, dan DELETE berhasil |
| 201 | POST berhasil (mengembalikan produk beserta id dari database) |
| 400 | Input tidak valid (name kosong, price bukan integer, id bukan angka, body JSON rusak) |
| 404 | Produk atau route tidak ditemukan |
| 500 | Kesalahan pada server |

Contoh response POST berhasil (201):

```json
{ "id": 1, "name": "Spidol", "price": 8000 }
```

Contoh response error (404):

```json
{ "message": "Produk tidak ditemukan" }
```

## Skenario Pengujian

Diuji dengan Postman (GANTI jika memakai Bruno atau Hoppscotch). Bukti ada di folder `Dokumentasi Bukti`.

| No | Request | Hasil yang diharapkan |
|---|---|---|
| 1 | `POST /products` `{"name":"Spidol","price":8000}` | 201, id dari database |
| 2 | `POST /products` `{"name":"Penghapus","price":3000}` | 201, id berbeda dari no 1 |
| 3 | `POST /products` `{"name":"","price":-5}` | 400 |
| 4 | `GET /products` | 200, array berisi 2 produk |
| 5 | `GET /products/{id no 1}` | 200, satu objek |
| 6 | `GET /products/999` | 404 |
| 7 | `GET /products/abc` | 400 |
| 8 | `PUT /products` `{"id":<id no 1>,"name":"Spidol Biru","price":9000}` | 200, data berubah |
| 9 | `PUT /products` `{"id":999,"name":"X","price":1}` | 404 |
| 10 | `DELETE /products/{id no 2}` | 200, produk hilang dari `GET /products` |
| 11 | Restart Express, lalu `GET /products` | Data masih ada (tersimpan di PostgreSQL) |

Pada skenario 11, yang di-restart hanya aplikasi Express. Database Neon tetap berjalan.

## Perubahan dari Week 9

- Array `products` dan `nextId` di memori dihapus (`data.ts` tidak dipakai lagi).
- Controller memakai Prisma Client (`findMany`, `findUnique`, `create`, `update`, `delete`).
- ID dibuat oleh database (`autoincrement`), bukan counter di Express.
- Route dan controller tetap dipisahkan. Ditambahkan endpoint PUT dan DELETE serta validasi input.
