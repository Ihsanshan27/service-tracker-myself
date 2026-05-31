import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ServiceSchedulesService } from '../service-schedules/service-schedules.service';
import { CreateOdometerLogDto } from './dto/create-odometer-log.dto';

@Injectable()
export class OdometerLogsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly schedules: ServiceSchedulesService,
  ) {}

  async create(userId: string, role: Role, dto: CreateOdometerLogDto) {
    await this.ensureVehicleAccess(userId, role, dto.vehicleId);
    const log = await this.prisma.odometerLog.create({ data: dto });
    await this.prisma.vehicle.update({ where: { id: dto.vehicleId }, data: { currentOdometer: dto.odometer } });
    await this.schedules.refreshVehicleStatuses(dto.vehicleId, dto.odometer);
    return log;
  }

  async findByVehicle(userId: string, role: Role, vehicleId: string) {
    await this.ensureVehicleAccess(userId, role, vehicleId);
    const [logs, vehicle, schedules] = await Promise.all([
      this.prisma.odometerLog.findMany({ where: { vehicleId }, orderBy: { recordedAt: 'desc' } }),
      this.prisma.vehicle.findUnique({ where: { id: vehicleId }, select: { currentOdometer: true } }),
      this.prisma.serviceSchedule.findMany({ where: { vehicleId }, include: { maintenanceItem: true }, orderBy: { nextServiceOdometer: 'asc' } }),
    ]);
    const averageKmPerDay = this.averageKmPerDay(logs);
    const serviceEstimates = schedules.map((schedule) => {
      const kmRemaining =
        typeof schedule.nextServiceOdometer === 'number' && vehicle
          ? Math.max(schedule.nextServiceOdometer - vehicle.currentOdometer, 0)
          : null;
      const estimatedDate =
        kmRemaining !== null && averageKmPerDay > 0
          ? new Date(Date.now() + Math.ceil(kmRemaining / averageKmPerDay) * 86_400_000)
          : null;

      return {
        scheduleId: schedule.id,
        maintenanceItemName: schedule.maintenanceItem.name,
        kmRemaining,
        estimatedDate,
      };
    });

    return { logs, averageKmPerDay, serviceEstimates };
  }

  private averageKmPerDay(logs: { odometer: number; recordedAt: Date }[]) {
    if (logs.length < 2) return 0;
    const sorted = [...logs].sort((a, b) => a.recordedAt.getTime() - b.recordedAt.getTime());
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const days = Math.max(1, Math.ceil((last.recordedAt.getTime() - first.recordedAt.getTime()) / 86_400_000));
    return Math.round(((last.odometer - first.odometer) / days) * 100) / 100;
  }

  private async ensureVehicleAccess(userId: string, role: Role, vehicleId: string) {
    const vehicle = await this.prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) throw new NotFoundException('Kendaraan tidak ditemukan');
    if (role !== Role.ADMIN && vehicle.userId !== userId) throw new ForbiddenException('Akses ditolak');
  }
}
