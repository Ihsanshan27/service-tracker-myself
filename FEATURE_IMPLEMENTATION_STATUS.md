# Vehicle Service Tracker - Status Implementasi Fitur

Dokumen ini membandingkan kebutuhan di `prompt.md` dengan kondisi implementasi project saat ini.

Status:

- `Sudah`: fitur utama sudah tersedia dan terhubung.
- `Parsial`: fondasi sudah ada, tetapi belum lengkap sesuai prompt.
- `Belum`: belum diimplementasikan.

## Ringkasan

| Area | Status | Catatan |
| --- | --- | --- |
| Database Prisma | Sudah | Schema utama, enum, relasi, dan seed data sudah tersedia. |
| Docker setup | Sudah | PostgreSQL, backend, frontend sudah ada di `docker-compose.yml`. |
| Backend REST API | Sudah | Endpoint utama untuk MVP tersedia dan terhubung ke frontend. |
| Authentication | Sudah | Register, login, JWT, profile, protected route backend/frontend tersedia. |
| RBAC | Sudah | Role guard admin tersedia dan dipakai pada endpoint admin/master data. |
| Frontend dashboard SaaS | Sudah | Layout, sidebar, topbar, card, table, chart, form, dan action utama tersedia. |
| User ownership filter | Sudah | Sebagian besar endpoint user sudah filter berdasarkan user login. |
| Reminder/backend calculation | Sudah | Status schedule dan dokumen dihitung di backend dan di-refresh saat data reminder/dashboard diakses. |

## 1. Authentication

| Fitur | Status | Catatan |
| --- | --- | --- |
| Register user | Sudah | `POST /auth/register`, halaman register tersedia. |
| Login user | Sudah | `POST /auth/login`, halaman login tersedia. |
| JWT access token | Sudah | Menggunakan `@nestjs/jwt` dan Passport JWT. |
| Protected route backend | Sudah | `JwtAuthGuard` tersedia. |
| Protected route frontend | Sudah | `ProtectedRoute` tersedia. |
| Role based access control | Sudah | `RolesGuard` dan decorator tersedia, dipakai untuk admin/master data. |
| Logout | Sudah | Frontend menghapus token dari localStorage. |
| Get current profile | Sudah | `GET /auth/profile`, halaman profile tersedia. |

## 2. Manajemen Kendaraan

| Fitur | Status | Catatan |
| --- | --- | --- |
| Model Vehicle | Sudah | Model lengkap di Prisma. |
| Tambah kendaraan | Sudah | Backend dan frontend tersedia. |
| Lihat daftar kendaraan | Sudah | Backend dan frontend tersedia. |
| Lihat detail kendaraan | Sudah | Backend dan frontend tersedia. |
| Edit kendaraan | Sudah | Backend dan frontend form edit tersedia. |
| Hapus kendaraan | Sudah | Backend dan frontend delete dengan confirmation modal tersedia. |
| Update kilometer kendaraan | Sudah | Backend dan frontend detail kendaraan tersedia. |
| Generate schedule saat kendaraan dibuat | Sudah | Backend generate dari template service. |

## 3. Maintenance Item

| Fitur | Status | Catatan |
| --- | --- | --- |
| Model MaintenanceItem | Sudah | Model dan enum vehicle type tersedia. |
| Admin CRUD maintenance item | Sudah | Backend CRUD dan frontend create/edit/delete tersedia. |
| Filter berdasarkan vehicleType | Sudah | Query `vehicleType` tersedia di backend. |
| Seed item motor/mobil | Sudah | Tersedia di `backend/prisma/seed.ts`. |

## 4. Template Service

| Fitur | Status | Catatan |
| --- | --- | --- |
| Model ServiceTemplate | Sudah | Model dan relasi tersedia. |
| Admin CRUD template service | Sudah | Backend CRUD dan frontend create/edit/delete tersedia. |
| Template motor | Sudah | Seed tersedia. |
| Template mobil | Sudah | Seed tersedia. |
| Digunakan saat kendaraan baru dibuat | Sudah | `generateFromTemplate` dipanggil setelah vehicle dibuat. |

## 5. Riwayat Service

| Fitur | Status | Catatan |
| --- | --- | --- |
| Model ServiceRecord | Sudah | Model lengkap termasuk invoice optional. |
| Tambah riwayat service | Sudah | Backend dan frontend tersedia. |
| Lihat riwayat service | Sudah | Backend dan frontend tersedia. |
| Lihat detail service | Sudah | Backend endpoint detail tersedia, frontend belum halaman detail khusus. |
| Edit service | Sudah | Backend dan frontend form edit tersedia. |
| Hapus service | Sudah | Backend dan frontend delete dengan confirmation modal tersedia. |
| Filter kendaraan/tanggal/jenis service | Sudah | Backend query filter dan frontend UI filter tersedia. |
| Update schedule setelah tambah service | Sudah | Backend upsert service schedule dari service record. |

## 6. Jadwal Service / Reminder

| Fitur | Status | Catatan |
| --- | --- | --- |
| Model ServiceSchedule | Sudah | Model lengkap tersedia. |
| Hitung nextServiceDate | Sudah | Dari service date + interval month. |
| Hitung nextServiceOdometer | Sudah | Dari odometer service + interval km. |
| Status SAFE / DUE_SOON / OVERDUE | Sudah | Logic tersedia di backend. |
| Generate jadwal dari riwayat service | Sudah | Saat service record dibuat/diupdate. |
| Generate jadwal dari template vehicle | Sudah | Saat kendaraan dibuat. |
| Lihat semua jadwal | Sudah | Backend dan frontend tersedia. |
| Lihat jadwal per kendaraan | Sudah | Backend tersedia, frontend detail kendaraan menampilkan schedule. |
| Update status otomatis berdasarkan tanggal/km | Sudah | Status di-refresh saat akses schedule/dashboard dan saat update odometer. |
| Reminder dashboard | Sudah | Dashboard user mengambil due soon/overdue schedule. |

## 7. Update Kilometer / Odometer Log

| Fitur | Status | Catatan |
| --- | --- | --- |
| Model OdometerLog | Sudah | Model tersedia. |
| Tambah log kilometer | Sudah | Backend dan frontend tersedia. |
| Lihat riwayat kilometer | Sudah | Backend dan frontend tersedia. |
| Update currentOdometer kendaraan | Sudah | Backend update vehicle saat log dibuat/update odometer. |
| Refresh schedule setelah update odometer | Sudah | Backend refresh status schedule. |
| Hitung rata-rata km per hari | Sudah | Backend menghitung `averageKmPerDay`. |
| Estimasi tanggal service berdasarkan rata-rata | Sudah | Backend mengembalikan estimasi per schedule dan frontend menampilkan estimasi di halaman odometer. |

## 8. Dashboard User

| Fitur | Status | Catatan |
| --- | --- | --- |
| Total kendaraan | Sudah | Backend dan frontend tersedia. |
| Total service bulan ini | Sudah | Backend dan frontend tersedia. |
| Total biaya bulan ini | Sudah | Backend dan frontend tersedia. |
| Kendaraan due soon | Sudah | Backend dan frontend tersedia. |
| Kendaraan overdue | Sudah | Backend tersedia, frontend menyatu di summary/list schedule. |
| Reminder pajak/STNK | Sudah | Dashboard menampilkan reminder dokumen due soon/expired beserta tipe dokumen. |
| List jadwal service terdekat | Sudah | Backend dan frontend tersedia. |
| Health score kendaraan | Sudah | Dashboard menampilkan health score global dan per kendaraan. |

## 9. Laporan Biaya Service

| Fitur | Status | Catatan |
| --- | --- | --- |
| Total biaya service semua kendaraan | Sudah | Backend dan frontend tersedia. |
| Total biaya per kendaraan | Sudah | Backend endpoint dan frontend tabel ringkas tersedia. |
| Total biaya per bulan | Sudah | Backend dan chart frontend tersedia. |
| Total biaya berdasarkan maintenance item | Sudah | Backend endpoint dan frontend tabel ringkas tersedia. |
| Riwayat pengeluaran service | Sudah | Frontend reports menampilkan pengeluaran terbaru. |
| Filter tanggal | Sudah | Backend mendukung filter dan frontend menyediakan input tanggal. |
| Filter kendaraan | Sudah | Backend mendukung filter dan frontend menyediakan select kendaraan. |
| Card summary | Sudah | Frontend tersedia. |
| Tabel | Sudah | Report menampilkan daftar pengeluaran, total per kendaraan, dan total per maintenance item. |
| Chart sederhana | Sudah | Menggunakan Recharts. |

## 10. Bengkel Langganan

| Fitur | Status | Catatan |
| --- | --- | --- |
| Model Workshop | Sudah | Model tersedia. |
| Tambah bengkel | Sudah | Backend dan frontend tersedia. |
| Lihat daftar bengkel | Sudah | Backend dan frontend tersedia. |
| Edit bengkel | Sudah | Backend dan frontend form edit tersedia. |
| Hapus bengkel | Sudah | Backend dan frontend delete dengan confirmation modal tersedia. |
| Pilih bengkel saat input service record | Sudah | Frontend service record menyediakan pilihan bengkel langganan dan input manual. |

## 11. Dokumen Kendaraan

| Fitur | Status | Catatan |
| --- | --- | --- |
| Model VehicleDocument | Sudah | Model dan enum tersedia. |
| Tambah dokumen | Sudah | Backend dan frontend detail kendaraan tersedia. |
| Lihat dokumen kendaraan | Sudah | Backend dan frontend tersedia. |
| Edit dokumen | Sudah | Backend dan frontend form edit tersedia. |
| Hapus dokumen | Sudah | Backend dan frontend delete dengan confirmation modal tersedia. |
| Reminder expired | Sudah | Dashboard user menampilkan document reminders. |
| Status SAFE / DUE_SOON / EXPIRED | Sudah | Backend menghitung status. |
| Upload file dokumen | Belum | Field `fileUrl` ada, upload storage belum ada. |

## 12. Dashboard Admin

| Fitur | Status | Catatan |
| --- | --- | --- |
| Total user | Sudah | Backend dan frontend tersedia. |
| Total kendaraan | Sudah | Backend dan frontend tersedia. |
| Total service record | Sudah | Backend dan frontend tersedia. |
| Total maintenance item | Sudah | Backend dan frontend tersedia. |
| Total template service | Sudah | Backend dan frontend tersedia. |
| User terbaru | Sudah | Backend dan frontend tersedia. |
| Statistik kendaraan berdasarkan jenis | Sudah | Backend dan frontend ringkasan statistik tersedia. |

## 13. UI/UX Requirement

| Komponen/Halaman | Status | Catatan |
| --- | --- | --- |
| Login | Sudah | Tersedia. |
| Register | Sudah | Tersedia. |
| User Dashboard | Sudah | Tersedia. |
| Vehicles Page | Sudah | Tersedia. |
| Vehicle Detail Page | Sudah | Tersedia. |
| Service Records Page | Sudah | Tersedia. |
| Service Schedule Page | Sudah | Tersedia. |
| Odometer Log Page | Sudah | Tersedia. |
| Workshop Page | Sudah | Tersedia. |
| Document Page | Sudah | Tersedia. |
| Reports Page | Sudah | Tersedia. |
| Profile Page | Sudah | Tersedia. |
| Admin Dashboard | Sudah | Tersedia. |
| Admin Users Page | Sudah | Tersedia. |
| Admin Maintenance Items Page | Sudah | List, create, edit, dan delete tersedia. |
| Admin Template Service Page | Sudah | List, create, edit, dan delete tersedia. |
| Sidebar navigation | Sudah | Tersedia. |
| Topbar | Sudah | Tersedia. |
| Card summary | Sudah | Tersedia. |
| Table | Sudah | Beberapa halaman memakai table. |
| Form modal atau form page | Sudah | Form dibuat sebagai form page/inline panel sesuai opsi requirement, dan confirmation delete modal tersedia. |
| Badge status | Sudah | `Badge` tersedia. |
| Empty state | Sudah | Komponen empty state tersedia dan dipakai pada halaman utama yang membutuhkan data kosong. |
| Loading state | Sudah | Loading state sederhana tersedia di halaman data utama. |
| Error state | Sudah | Error state dasar tersedia untuk auth dan flow utama tetap bisa dikembangkan ke global handler. |
| Confirmation delete modal | Sudah | Komponen `ConfirmDialog` tersedia dan dipakai di beberapa CRUD utama. |

## 14. Backend Module Requirement

| Module | Status |
| --- | --- |
| AuthModule | Sudah |
| UsersModule | Sudah |
| VehiclesModule | Sudah |
| MaintenanceItemsModule | Sudah |
| ServiceTemplatesModule | Sudah |
| ServiceRecordsModule | Sudah |
| ServiceSchedulesModule | Sudah |
| OdometerLogsModule | Sudah |
| WorkshopsModule | Sudah |
| VehicleDocumentsModule | Sudah |
| ReportsModule | Sudah |
| DashboardModule | Sudah |

## 15. Database Requirement

| Requirement | Status | Catatan |
| --- | --- | --- |
| User | Sudah | Model tersedia. |
| Vehicle | Sudah | Model tersedia. |
| MaintenanceItem | Sudah | Model tersedia. |
| ServiceTemplate | Sudah | Model tersedia. |
| ServiceRecord | Sudah | Model tersedia. |
| ServiceSchedule | Sudah | Model tersedia. |
| OdometerLog | Sudah | Model tersedia. |
| Workshop | Sudah | Model tersedia. |
| VehicleDocument | Sudah | Model tersedia. |
| Enum Role | Sudah | USER, ADMIN. |
| Enum VehicleType | Sudah | MOTOR, MOBIL. |
| Enum ScheduleStatus | Sudah | SAFE, DUE_SOON, OVERDUE. |
| Enum DocumentType | Sudah | STNK, PAJAK, ASURANSI, GARANSI, LAINNYA. |
| Enum DocumentStatus | Sudah | SAFE, DUE_SOON, EXPIRED. |
| Relasi utama | Sudah | Relasi user, vehicle, service, schedule, log, document tersedia. |

## 16. Business Logic

| Logic | Status | Catatan |
| --- | --- | --- |
| Generate schedule saat kendaraan baru dibuat | Sudah | Berdasarkan template service vehicle type. |
| Update/generate schedule saat service record dibuat | Sudah | Menggunakan `upsertFromServiceRecord`. |
| Update odometer sekaligus currentOdometer | Sudah | Tersedia. |
| Refresh status service setelah odometer update | Sudah | Tersedia. |
| Status schedule otomatis berdasarkan tanggal/km | Sudah | Dihitung di backend dan di-refresh saat schedule/dashboard diakses serta saat odometer berubah. |
| Status dokumen otomatis berdasarkan expiryDate | Sudah | Dihitung di backend saat create/update/fetch dan di-refresh saat dashboard diakses. |
| Dashboard mengambil data hasil perhitungan backend | Sudah | Tersedia. |

## 17. Seed Data

| Seed | Status |
| --- | --- |
| Admin user | Sudah |
| Maintenance item motor | Sudah |
| Maintenance item mobil | Sudah |
| Template service motor | Sudah |
| Template service mobil | Sudah |

## 18. Security

| Requirement | Status | Catatan |
| --- | --- | --- |
| Password hash bcrypt | Sudah | Register dan seed admin memakai bcrypt. |
| JWT guard | Sudah | Tersedia. |
| Role guard admin | Sudah | Tersedia. |
| User hanya akses data sendiri | Sudah | Diterapkan pada kendaraan, service, schedule, dokumen, bengkel, laporan. |
| Admin akses master data | Sudah | Maintenance item, template, users, dashboard admin. |
| Refresh token | Belum | Tidak diminta eksplisit, belum ada. |
| Rate limiting | Belum | Belum ada. |

## 19. DevOps / Running Project

| Item | Status | Catatan |
| --- | --- | --- |
| Backend runnable lokal | Sudah | Dengan PostgreSQL Docker dan `.env` benar. |
| Frontend runnable lokal | Sudah | Vite dev server. |
| Docker PostgreSQL | Sudah | Port host disarankan `5433`. |
| Docker backend | Sudah | Tersedia di compose. |
| Docker frontend | Sudah | Nginx static build. |
| README instruksi run | Sudah | Termasuk troubleshooting database. |

## Prioritas Lanjutan yang Disarankan

1. Tambahkan upload file untuk invoice dan dokumen.
2. Tambahkan global error handling dan loading state yang konsisten di frontend.
3. Tambahkan test backend untuk auth, ownership, service schedule, dan reports.
4. Pertimbangkan form modal untuk create/edit agar layout lebih ringkas.
5. Pertimbangkan refresh token dan rate limiting jika aplikasi akan dipakai production.
