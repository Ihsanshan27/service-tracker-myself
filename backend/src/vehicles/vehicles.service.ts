import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ServiceSchedulesService } from '../service-schedules/service-schedules.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly schedules: ServiceSchedulesService,
  ) {}

  async create(userId: string, dto: CreateVehicleDto) {
    const vehicle = await this.prisma.vehicle.create({ data: { ...dto, userId } });
    await this.schedules.generateFromTemplate(vehicle.id, userId);
    return this.findOne(userId, Role.USER, vehicle.id);
  }

  findAll(userId: string, role: Role) {
    return this.prisma.vehicle.findMany({
      where: role === Role.ADMIN ? undefined : { userId },
      include: { _count: { select: { serviceRecords: true, schedules: true, documents: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, role: Role, id: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
      include: {
        schedules: { include: { maintenanceItem: true }, orderBy: { nextServiceDate: 'asc' } },
        documents: true,
      },
    });
    if (!vehicle) throw new NotFoundException('Kendaraan tidak ditemukan');
    if (role !== Role.ADMIN && vehicle.userId !== userId) throw new ForbiddenException('Akses ditolak');
    return vehicle;
  }

  async update(userId: string, role: Role, id: string, dto: UpdateVehicleDto) {
    await this.findOne(userId, role, id);
    const vehicle = await this.prisma.vehicle.update({ where: { id }, data: dto });
    await this.schedules.refreshVehicleStatuses(vehicle.id, vehicle.currentOdometer);
    return vehicle;
  }

  async remove(userId: string, role: Role, id: string) {
    await this.findOne(userId, role, id);
    await this.prisma.vehicle.delete({ where: { id } });
    return { message: 'Kendaraan berhasil dihapus' };
  }

  async updateOdometer(userId: string, role: Role, id: string, odometer: number) {
    const vehicle = await this.findOne(userId, role, id);
    const updated = await this.prisma.vehicle.update({
      where: { id },
      data: {
        currentOdometer: odometer,
        odometerLogs: { create: { odometer, recordedAt: new Date(), notes: 'Update kilometer kendaraan' } },
      },
    });
    await this.schedules.refreshVehicleStatuses(vehicle.id, odometer);
    return updated;
  }
}
