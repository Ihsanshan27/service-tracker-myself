import { PrismaClient, Role, VehicleType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const motorItems = [
  ['Ganti oli mesin', 3000, 2],
  ['Ganti oli gardan', 8000, 6],
  ['Service CVT', 10000, 6],
  ['Ganti busi', 10000, 12],
  ['Ganti filter udara', 10000, 12],
];

const mobilItems = [
  ['Ganti oli mesin', 10000, 6],
  ['Ganti filter oli', 10000, 6],
  ['Tune up', 10000, 6],
  ['Spooring balancing', 15000, 12],
  ['Cek aki', 0, 6],
];

async function upsertItems(items: (string | number)[][], vehicleType: VehicleType) {
  for (const [name, km, month] of items) {
    const item = await prisma.maintenanceItem.upsert({
      where: { name_vehicleType: { name: String(name), vehicleType } },
      update: {
        description: `${name} untuk ${vehicleType.toLowerCase()}`,
        defaultIntervalKm: Number(km),
        defaultIntervalMonth: Number(month),
      },
      create: {
        name: String(name),
        description: `${name} untuk ${vehicleType.toLowerCase()}`,
        defaultIntervalKm: Number(km),
        defaultIntervalMonth: Number(month),
        vehicleType,
      },
    });

    await prisma.serviceTemplate.upsert({
      where: { vehicleType_maintenanceItemId: { vehicleType, maintenanceItemId: item.id } },
      update: {
        intervalKm: Number(km),
        intervalMonth: Number(month),
      },
      create: {
        vehicleType,
        maintenanceItemId: item.id,
        intervalKm: Number(km),
        intervalMonth: Number(month),
      },
    });
  }
}

async function main() {
  const password = await bcrypt.hash('admin123456', 12);
  await prisma.user.upsert({
    where: { email: 'admin@vehicletracker.com' },
    update: { password, role: Role.ADMIN },
    create: {
      email: 'admin@vehicletracker.com',
      name: 'Vehicle Tracker Admin',
      password,
      role: Role.ADMIN,
    },
  });
  await upsertItems(motorItems, VehicleType.MOTOR);
  await upsertItems(mobilItems, VehicleType.MOBIL);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
