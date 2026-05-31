import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ServiceSchedulesService } from '../service-schedules/service-schedules.service';
import { CreateServiceRecordDto } from './dto/create-service-record.dto';
import { UpdateServiceRecordDto } from './dto/update-service-record.dto';

type RecordFilters = {
  vehicleId?: string;
  maintenanceItemId?: string;
  from?: string;
  to?: string;
};

@Injectable()
export class ServiceRecordsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly schedules: ServiceSchedulesService,
  ) {}

  async create(userId: string, dto: CreateServiceRecordDto) {
    await this.ensureVehicleAccess(userId, Role.USER, dto.vehicleId);
    const record = await this.prisma.serviceRecord.create({ data: dto, include: { maintenanceItem: true, vehicle: true } });
    if (dto.odometerAtService > record.vehicle.currentOdometer) {
      await this.prisma.vehicle.update({ where: { id: dto.vehicleId }, data: { currentOdometer: dto.odometerAtService } });
    }
    await this.schedules.upsertFromServiceRecord(record.id);
    return record;
  }

  findAll(userId: string, role: Role, filters: RecordFilters) {
    return this.prisma.serviceRecord.findMany({
      where: {
        vehicle: role === Role.ADMIN ? undefined : { userId },
        vehicleId: filters.vehicleId,
        maintenanceItemId: filters.maintenanceItemId,
        serviceDate:
          filters.from || filters.to
            ? {
                gte: filters.from ? new Date(filters.from) : undefined,
                lte: filters.to ? new Date(filters.to) : undefined,
              }
            : undefined,
      },
      include: { vehicle: true, maintenanceItem: true },
      orderBy: { serviceDate: 'desc' },
    });
  }

  async findOne(userId: string, role: Role, id: string) {
    const record = await this.prisma.serviceRecord.findUnique({
      where: { id },
      include: { vehicle: true, maintenanceItem: true },
    });
    if (!record) throw new NotFoundException('Riwayat service tidak ditemukan');
    if (role !== Role.ADMIN && record.vehicle.userId !== userId) throw new ForbiddenException('Akses ditolak');
    return record;
  }

  async update(userId: string, role: Role, id: string, dto: UpdateServiceRecordDto) {
    await this.findOne(userId, role, id);
    if (dto.vehicleId) await this.ensureVehicleAccess(userId, role, dto.vehicleId);
    const record = await this.prisma.serviceRecord.update({
      where: { id },
      data: dto,
      include: { vehicle: true, maintenanceItem: true },
    });
    await this.schedules.upsertFromServiceRecord(record.id);
    return record;
  }

  async remove(userId: string, role: Role, id: string) {
    await this.findOne(userId, role, id);
    await this.prisma.serviceRecord.delete({ where: { id } });
    return { message: 'Riwayat service berhasil dihapus' };
  }

  private async ensureVehicleAccess(userId: string, role: Role, vehicleId: string) {
    const vehicle = await this.prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) throw new NotFoundException('Kendaraan tidak ditemukan');
    if (role !== Role.ADMIN && vehicle.userId !== userId) throw new ForbiddenException('Akses ditolak');
  }
}
