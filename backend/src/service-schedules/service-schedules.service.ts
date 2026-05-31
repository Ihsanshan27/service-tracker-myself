import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Role, ScheduleStatus } from '@prisma/client';
import { addMonths, getScheduleStatus } from '../common/date-status';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServiceSchedulesService {
  constructor(private readonly prisma: PrismaService) {}

  async generateFromTemplate(vehicleId: string, userId: string) {
    const vehicle = await this.prisma.vehicle.findFirst({ where: { id: vehicleId, userId } });
    if (!vehicle) throw new NotFoundException('Kendaraan tidak ditemukan');

    const templates = await this.prisma.serviceTemplate.findMany({
      where: { vehicleType: vehicle.vehicleType },
      include: { maintenanceItem: true },
    });

    const now = new Date();
    await Promise.all(
      templates.map((template) =>
        this.prisma.serviceSchedule.upsert({
          where: { vehicleId_maintenanceItemId: { vehicleId, maintenanceItemId: template.maintenanceItemId } },
          update: {},
          create: {
            vehicleId,
            maintenanceItemId: template.maintenanceItemId,
            lastServiceDate: now,
            lastServiceOdometer: vehicle.currentOdometer,
            nextServiceDate: addMonths(now, template.intervalMonth),
            nextServiceOdometer: vehicle.currentOdometer + template.intervalKm,
            status: getScheduleStatus({
              nextServiceDate: addMonths(now, template.intervalMonth),
              nextServiceOdometer: vehicle.currentOdometer + template.intervalKm,
              currentOdometer: vehicle.currentOdometer,
            }),
          },
        }),
      ),
    );
    return this.findByVehicle(userId, Role.USER, vehicleId);
  }

  async upsertFromServiceRecord(recordId: string) {
    const record = await this.prisma.serviceRecord.findUnique({
      where: { id: recordId },
      include: { vehicle: true, maintenanceItem: true },
    });
    if (!record) throw new NotFoundException('Riwayat service tidak ditemukan');

    const nextServiceDate = addMonths(record.serviceDate, record.maintenanceItem.defaultIntervalMonth);
    const nextServiceOdometer = record.odometerAtService + record.maintenanceItem.defaultIntervalKm;

    return this.prisma.serviceSchedule.upsert({
      where: {
        vehicleId_maintenanceItemId: {
          vehicleId: record.vehicleId,
          maintenanceItemId: record.maintenanceItemId,
        },
      },
      update: {
        lastServiceRecordId: record.id,
        lastServiceDate: record.serviceDate,
        lastServiceOdometer: record.odometerAtService,
        nextServiceDate,
        nextServiceOdometer,
        status: getScheduleStatus({
          nextServiceDate,
          nextServiceOdometer,
          currentOdometer: record.vehicle.currentOdometer,
        }),
      },
      create: {
        vehicleId: record.vehicleId,
        maintenanceItemId: record.maintenanceItemId,
        lastServiceRecordId: record.id,
        lastServiceDate: record.serviceDate,
        lastServiceOdometer: record.odometerAtService,
        nextServiceDate,
        nextServiceOdometer,
        status: getScheduleStatus({
          nextServiceDate,
          nextServiceOdometer,
          currentOdometer: record.vehicle.currentOdometer,
        }),
      },
    });
  }

  async refreshVehicleStatuses(vehicleId: string, currentOdometer: number) {
    const schedules = await this.prisma.serviceSchedule.findMany({ where: { vehicleId } });
    await Promise.all(
      schedules.map((schedule) =>
        this.prisma.serviceSchedule.update({
          where: { id: schedule.id },
          data: {
            status: getScheduleStatus({
              nextServiceDate: schedule.nextServiceDate,
              nextServiceOdometer: schedule.nextServiceOdometer,
              currentOdometer,
            }),
          },
        }),
      ),
    );
  }

  async findAll(userId: string, role: Role) {
    return this.prisma.serviceSchedule.findMany({
      where: role === Role.ADMIN ? undefined : { vehicle: { userId } },
      include: { vehicle: true, maintenanceItem: true },
      orderBy: [{ status: 'desc' }, { nextServiceDate: 'asc' }],
    });
  }

  async findByVehicle(userId: string, role: Role, vehicleId: string) {
    await this.ensureVehicleAccess(userId, role, vehicleId);
    const vehicle = await this.prisma.vehicle.findUnique({ where: { id: vehicleId }, select: { currentOdometer: true } });
    if (vehicle) await this.refreshVehicleStatuses(vehicleId, vehicle.currentOdometer);
    return this.prisma.serviceSchedule.findMany({
      where: { vehicleId },
      include: { maintenanceItem: true },
      orderBy: { nextServiceDate: 'asc' },
    });
  }

  async updateStatus(userId: string, role: Role, id: string, status: ScheduleStatus) {
    const schedule = await this.prisma.serviceSchedule.findUnique({ where: { id }, include: { vehicle: true } });
    if (!schedule) throw new NotFoundException('Jadwal service tidak ditemukan');
    if (role !== Role.ADMIN && schedule.vehicle.userId !== userId) throw new ForbiddenException('Akses ditolak');
    return this.prisma.serviceSchedule.update({ where: { id }, data: { status } });
  }

  private async ensureVehicleAccess(userId: string, role: Role, vehicleId: string) {
    const vehicle = await this.prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) throw new NotFoundException('Kendaraan tidak ditemukan');
    if (role !== Role.ADMIN && vehicle.userId !== userId) throw new ForbiddenException('Akses ditolak');
  }
}
