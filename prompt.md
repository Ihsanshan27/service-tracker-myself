Saya ingin membangun aplikasi web bernama “Vehicle Service Tracker”.

Aplikasi ini digunakan untuk membantu pengguna mencatat kendaraan pribadi dan mengingatkan kapan kendaraan harus melakukan service berkala. Target user adalah orang yang sering lupa jadwal service motor/mobil, lupa kapan terakhir ganti oli, lupa pajak STNK, dan ingin melihat riwayat biaya perawatan kendaraannya.

Gunakan stack berikut:

Backend:
- NestJS
- PostgreSQL
- Prisma ORM
- JWT Authentication
- RBAC sederhana
- Validasi menggunakan class-validator
- Struktur project clean dan scalable

Database:
- PostgreSQL menggunakan Neon
- Gunakan Prisma schema yang rapi
- Buat relasi database yang proper

Frontend:
- React + Vite
- TypeScript
- Tailwind CSS
- React Router
- Axios
- UI modern, clean, responsive
- Dashboard style SaaS modern

Role:
1. USER
2. ADMIN

USER dapat:
- Register dan login
- Mengelola data kendaraan miliknya sendiri
- Menambahkan riwayat service kendaraan
- Mengatur jadwal service kendaraan
- Update kilometer kendaraan
- Melihat reminder service
- Melihat laporan biaya service
- Mengelola dokumen kendaraan seperti STNK, pajak, asuransi, dan garansi
- Mengelola data bengkel langganan

ADMIN dapat:
- Melihat dashboard admin
- Mengelola data user
- Mengelola master jenis kendaraan
- Mengelola master item maintenance
- Mengelola template service berdasarkan jenis kendaraan
- Melihat statistik sistem

Fitur utama aplikasi:

1. Authentication
- Register user
- Login user
- JWT access token
- Protected route
- Role based access control
- Logout
- Get current profile

2. Manajemen Kendaraan
User bisa menambahkan banyak kendaraan.
Data kendaraan:
- id
- userId
- vehicleName
- vehicleType: MOTOR / MOBIL
- brand
- model
- year
- plateNumber
- currentOdometer
- photoUrl optional
- notes optional
- createdAt
- updatedAt

Fitur:
- Tambah kendaraan
- Lihat daftar kendaraan
- Lihat detail kendaraan
- Edit kendaraan
- Hapus kendaraan
- Update kilometer kendaraan

3. Maintenance Item
Maintenance item adalah jenis perawatan kendaraan.
Contoh:
- Ganti oli mesin
- Ganti oli gardan
- Service CVT
- Ganti busi
- Ganti filter udara
- Ganti kampas rem
- Ganti ban
- Tune up
- Spooring balancing
- Cek aki
- Pajak tahunan
- Perpanjang STNK

Data maintenance item:
- id
- name
- description
- defaultIntervalKm
- defaultIntervalMonth
- vehicleType
- createdAt
- updatedAt

Admin bisa CRUD maintenance item.

4. Template Service
Template service digunakan agar ketika user menambahkan kendaraan baru, sistem bisa menyarankan daftar service bawaan berdasarkan jenis kendaraan.

Contoh Motor Matic:
- Ganti oli mesin setiap 3000 km atau 2 bulan
- Ganti oli gardan setiap 8000 km atau 6 bulan
- Service CVT setiap 10000 km atau 6 bulan
- Ganti busi setiap 10000 km atau 12 bulan
- Ganti filter udara setiap 10000 km atau 12 bulan

Contoh Mobil:
- Ganti oli mesin setiap 10000 km atau 6 bulan
- Ganti filter oli setiap 10000 km atau 6 bulan
- Tune up setiap 10000 km atau 6 bulan
- Spooring balancing setiap 15000 km atau 12 bulan
- Cek aki setiap 6 bulan

Admin bisa CRUD template service.

5. Riwayat Service
User bisa mencatat service kendaraan yang pernah dilakukan.

Data service record:
- id
- vehicleId
- maintenanceItemId
- serviceDate
- odometerAtService
- workshopName
- cost
- notes
- invoiceImageUrl optional
- createdAt
- updatedAt

Fitur:
- Tambah riwayat service
- Lihat riwayat service per kendaraan
- Lihat detail service
- Edit service
- Hapus service
- Filter berdasarkan kendaraan
- Filter berdasarkan tanggal
- Filter berdasarkan jenis service

6. Jadwal Service / Service Reminder
Setelah user menambahkan riwayat service, sistem harus bisa menghitung service berikutnya.

Logika:
- Setiap maintenance item punya interval berdasarkan kilometer dan bulan.
- Next service date dihitung dari serviceDate + intervalMonth.
- Next service odometer dihitung dari odometerAtService + intervalKm.
- Service dianggap “DUE_SOON” jika:
  - Sisa hari <= 7 hari, atau
  - Sisa kilometer <= 500 km
- Service dianggap “OVERDUE” jika:
  - Tanggal sekarang sudah melewati nextServiceDate, atau
  - currentOdometer sudah melewati nextServiceOdometer
- Service dianggap “SAFE” jika belum mendekati batas.

Data service schedule:
- id
- vehicleId
- maintenanceItemId
- lastServiceRecordId optional
- lastServiceDate
- lastServiceOdometer
- nextServiceDate
- nextServiceOdometer
- status: SAFE / DUE_SOON / OVERDUE
- createdAt
- updatedAt

Fitur:
- Generate jadwal service dari riwayat service
- Lihat semua jadwal service
- Lihat jadwal service per kendaraan
- Update status service otomatis berdasarkan tanggal dan odometer
- Tampilkan reminder di dashboard

7. Update Kilometer / Odometer Log
User bisa update kilometer kendaraan secara berkala.

Data:
- id
- vehicleId
- odometer
- recordedAt
- notes optional
- createdAt

Fitur:
- Tambah log kilometer
- Lihat riwayat kilometer
- Saat update kilometer, update juga currentOdometer di kendaraan
- Hitung rata-rata pemakaian km per hari berdasarkan odometer log
- Estimasi kapan service berikutnya tercapai berdasarkan rata-rata pemakaian

8. Dashboard User
Dashboard user harus menampilkan:
- Total kendaraan
- Total service bulan ini
- Total biaya service bulan ini
- Kendaraan yang service-nya sudah dekat
- Kendaraan yang service-nya overdue
- Reminder pajak/STNK
- List jadwal service terdekat
- Health score kendaraan

Health score logic sederhana:
- 100 jika semua schedule SAFE
- 80 jika ada DUE_SOON
- 60 jika ada 1 OVERDUE
- 40 jika lebih dari 1 OVERDUE

Tampilkan dashboard dengan card modern dan tabel ringkas.

9. Laporan Biaya Service
User bisa melihat laporan biaya perawatan kendaraan.

Fitur:
- Total biaya service semua kendaraan
- Total biaya per kendaraan
- Total biaya per bulan
- Total biaya berdasarkan maintenance item
- Riwayat pengeluaran service
- Filter tanggal
- Filter kendaraan

Tampilkan dalam bentuk:
- Card summary
- Tabel
- Chart sederhana

10. Bengkel Langganan
User bisa menyimpan data bengkel.

Data:
- id
- userId
- name
- address
- phone
- rating optional
- notes optional
- createdAt
- updatedAt

Fitur:
- Tambah bengkel
- Lihat daftar bengkel
- Edit bengkel
- Hapus bengkel
- Pilih bengkel saat input service record

11. Dokumen Kendaraan
User bisa menyimpan dokumen kendaraan.

Data:
- id
- vehicleId
- documentType: STNK / PAJAK / ASURANSI / GARANSI / LAINNYA
- documentName
- documentNumber optional
- expiryDate optional
- fileUrl optional
- notes optional
- createdAt
- updatedAt

Fitur:
- Tambah dokumen
- Lihat dokumen kendaraan
- Edit dokumen
- Hapus dokumen
- Reminder dokumen yang akan expired
- Status dokumen: SAFE / DUE_SOON / EXPIRED

12. Dashboard Admin
Admin dashboard menampilkan:
- Total user
- Total kendaraan
- Total service record
- Total maintenance item
- Total template service
- User terbaru
- Statistik kendaraan berdasarkan jenis

13. UI/UX Requirement
Buat UI dengan gaya modern SaaS dashboard.

Halaman frontend:
- Login
- Register
- User Dashboard
- Vehicles Page
- Vehicle Detail Page
- Service Records Page
- Service Schedule Page
- Odometer Log Page
- Workshop Page
- Document Page
- Reports Page
- Profile Page
- Admin Dashboard
- Admin Users Page
- Admin Maintenance Items Page
- Admin Template Service Page

Komponen UI:
- Sidebar navigation
- Topbar
- Card summary
- Table
- Form modal atau form page
- Badge status SAFE / DUE_SOON / OVERDUE / EXPIRED
- Empty state
- Loading state
- Error state
- Confirmation delete modal

14. Backend Requirement
Buat module NestJS:
- AuthModule
- UsersModule
- VehiclesModule
- MaintenanceItemsModule
- ServiceTemplatesModule
- ServiceRecordsModule
- ServiceSchedulesModule
- OdometerLogsModule
- WorkshopsModule
- VehicleDocumentsModule
- ReportsModule
- DashboardModule

Buat endpoint REST API yang rapi.

Contoh endpoint:
Auth:
- POST /auth/register
- POST /auth/login
- GET /auth/profile

Vehicles:
- GET /vehicles
- POST /vehicles
- GET /vehicles/:id
- PATCH /vehicles/:id
- DELETE /vehicles/:id
- PATCH /vehicles/:id/odometer

Maintenance Items:
- GET /maintenance-items
- POST /maintenance-items
- GET /maintenance-items/:id
- PATCH /maintenance-items/:id
- DELETE /maintenance-items/:id

Service Records:
- GET /service-records
- POST /service-records
- GET /service-records/:id
- PATCH /service-records/:id
- DELETE /service-records/:id

Service Schedules:
- GET /service-schedules
- GET /service-schedules/vehicle/:vehicleId
- POST /service-schedules/generate/:vehicleId
- PATCH /service-schedules/:id/status

Odometer Logs:
- GET /odometer-logs/vehicle/:vehicleId
- POST /odometer-logs

Workshops:
- GET /workshops
- POST /workshops
- PATCH /workshops/:id
- DELETE /workshops/:id

Vehicle Documents:
- GET /vehicle-documents/vehicle/:vehicleId
- POST /vehicle-documents
- PATCH /vehicle-documents/:id
- DELETE /vehicle-documents/:id

Reports:
- GET /reports/service-cost
- GET /reports/service-cost/monthly
- GET /reports/service-cost/by-vehicle
- GET /reports/service-cost/by-maintenance-item

Dashboard:
- GET /dashboard/user
- GET /dashboard/admin

15. Database Requirement
Buat Prisma schema lengkap dengan model:
- User
- Vehicle
- MaintenanceItem
- ServiceTemplate
- ServiceRecord
- ServiceSchedule
- OdometerLog
- Workshop
- VehicleDocument

Gunakan enum:
- Role: USER, ADMIN
- VehicleType: MOTOR, MOBIL
- ScheduleStatus: SAFE, DUE_SOON, OVERDUE
- DocumentType: STNK, PAJAK, ASURANSI, GARANSI, LAINNYA
- DocumentStatus: SAFE, DUE_SOON, EXPIRED

Pastikan relasi antar tabel benar:
- User punya banyak Vehicle
- User punya banyak Workshop
- Vehicle punya banyak ServiceRecord
- Vehicle punya banyak ServiceSchedule
- Vehicle punya banyak OdometerLog
- Vehicle punya banyak VehicleDocument
- MaintenanceItem punya banyak ServiceRecord
- MaintenanceItem punya banyak ServiceSchedule
- MaintenanceItem punya banyak ServiceTemplate

16. Business Logic
Tolong implementasikan logic berikut:
- Saat user membuat kendaraan baru, sistem bisa generate service schedule berdasarkan template service sesuai vehicleType.
- Saat user menambahkan service record baru, sistem update atau generate ulang service schedule untuk maintenance item tersebut.
- Saat user update odometer, sistem update currentOdometer kendaraan dan refresh status service schedule.
- Status service schedule otomatis berubah berdasarkan tanggal dan kilometer.
- Status dokumen otomatis berubah berdasarkan expiryDate.
- Dashboard mengambil data yang sudah dihitung dari service schedule dan dokumen.

17. Seed Data
Buat seed data untuk:
- Admin user
- Maintenance item motor
- Maintenance item mobil
- Template service motor
- Template service mobil

Admin default:
email: admin@vehicletracker.com
password: admin123456

18. Security
- Password harus di-hash menggunakan bcrypt
- JWT guard untuk protected route
- Role guard untuk admin route
- User hanya boleh mengakses data miliknya sendiri
- Admin boleh mengakses data master

19. Output yang saya inginkan
Tolong buatkan project fullstack yang bisa langsung dijalankan.

Backend:
- Berikan struktur folder NestJS
- Buat Prisma schema
- Buat DTO
- Buat service
- Buat controller
- Buat guard auth dan role
- Buat seed data
- Buat instruksi menjalankan backend

Frontend:
- Berikan struktur folder React
- Buat routing
- Buat halaman-halaman utama
- Buat komponen reusable
- Buat API service menggunakan Axios
- Buat protected route
- Buat layout dashboard
- Buat UI yang clean dan responsive
- Buat instruksi menjalankan frontend

20. Prioritas pengerjaan
Kerjakan dengan urutan:
1. Setup database schema Prisma
2. Backend authentication
3. Backend vehicle CRUD
4. Backend maintenance item
5. Backend service record
6. Backend service schedule logic
7. Backend odometer log
8. Backend documents
9. Backend reports
10. Frontend authentication
11. Frontend dashboard layout
12. Frontend vehicle page
13. Frontend service record page
14. Frontend service schedule page
15. Frontend reports page
16. Frontend admin page

Pastikan kode rapi, tidak asal generate, dan bisa dikembangkan lagi.
Gunakan nama variabel yang jelas.
Gunakan error handling yang proper.
Gunakan response API yang konsisten.

Catatan penting:
- Jangan membuat fitur premium dulu.
- Jangan membuat payment gateway.
- Jangan membuat fitur bengkel sebagai role dulu.
- Fokus MVP yang solid.
- Jangan hardcode data user.
- Jangan membuat semua logic hanya di frontend.
- Semua perhitungan reminder, status service, dan laporan harus dilakukan di backend.
- Frontend hanya menampilkan data dari API.
- Pastikan semua endpoint yang berhubungan dengan user memfilter data berdasarkan user yang sedang login.
- Gunakan TypeScript secara proper.
- Hindari any jika tidak diperlukan.
- Buat kode modular agar mudah ditambahkan fitur di masa depan.