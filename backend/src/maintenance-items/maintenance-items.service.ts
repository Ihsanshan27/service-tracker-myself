import { Injectable, NotFoundException } from '@nestjs/common';
import { VehicleType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMaintenanceItemDto } from './dto/create-maintenance-item.dto';
import { UpdateMaintenanceItemDto } from './dto/update-maintenance-item.dto';

@Injectable()
export class MaintenanceItemsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(vehicleType?: VehicleType) {
    return this.prisma.maintenanceItem.findMany({ where: { vehicleType }, orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const item = await this.prisma.maintenanceItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Maintenance item tidak ditemukan');
    return item;
  }

  create(dto: CreateMaintenanceItemDto) {
    return this.prisma.maintenanceItem.create({ data: dto });
  }

  async update(id: string, dto: UpdateMaintenanceItemDto) {
    await this.findOne(id);
    return this.prisma.maintenanceItem.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.maintenanceItem.delete({ where: { id } });
    return { message: 'Maintenance item berhasil dihapus' };
  }
}
