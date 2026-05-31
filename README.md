# Vehicle Service Tracker

Fullstack MVP untuk mencatat kendaraan pribadi, riwayat service, jadwal reminder, dokumen kendaraan, bengkel langganan, laporan biaya, dan dashboard admin.

## Backend

```bash
cd backend
cp .env.example .env
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run start:dev
```

Isi `DATABASE_URL` dengan connection string PostgreSQL Neon. API berjalan di `http://localhost:3001`.

Admin default:

- Email: `admin@vehicletracker.com`
- Password: `admin123456`

## Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend berjalan di `http://localhost:5173`.

## Docker

Jalankan seluruh stack lokal dengan PostgreSQL container:

```bash
docker compose up --build
```

URL:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001`
- PostgreSQL: `localhost:5432`

Docker akan menjalankan `prisma db push` dan seed admin/master data saat backend container start.

Untuk stop:

```bash
docker compose down
```

Untuk hapus database lokal Docker:

```bash
docker compose down -v
```

## Troubleshooting Database

Jika backend dijalankan lokal dengan `npm run start:dev`, isi `backend/.env` seperti ini:

```env
DATABASE_URL="postgresql://vehicle_tracker:vehicle_tracker_password@127.0.0.1:5432/vehicle_tracker?schema=public"
JWT_SECRET="change-me-in-production"
JWT_EXPIRES_IN="1d"
PORT=3001
```

Jangan pakai `@5432/vehicle_tracker`, karena `5432` akan dibaca sebagai host database.

Urutan setup database lokal dengan PostgreSQL dari Docker:

```bash
docker compose up -d postgres
cd backend
npm run db:generate
npx prisma db push
npm run db:seed
npm run start:dev
```

Jika backend dijalankan di dalam Docker Compose, host database harus `postgres`, seperti di `docker-compose.yml`:

```env
DATABASE_URL="postgresql://vehicle_tracker:vehicle_tracker_password@postgres:5432/vehicle_tracker?schema=public"
```

Jika masih muncul `Authentication failed`, kemungkinan volume PostgreSQL lama masih menyimpan credential berbeda. Reset database Docker:

```bash
docker compose down -v
docker compose up -d postgres
cd backend
npx prisma db push
npm run db:seed
```
