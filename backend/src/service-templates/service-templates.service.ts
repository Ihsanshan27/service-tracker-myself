import { Injectable, NotFoundException } from '@nestjs/common';
import { VehicleType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceTemplateDto } from './dto/create-service-template.dto';
import { UpdateServiceTemplateDto } from './dto/update-service-template.dto';

@Injectable()
export class ServiceTemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(vehicleType?: VehicleType) {
    return this.prisma.serviceTemplate.findMany({
      where: { vehicleType },
      include: { maintenanceItem: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const template = await this.prisma.serviceTemplate.findUnique({ where: { id }, include: { maintenanceItem: true } });
    if (!template) throw new NotFoundException('Template service tidak ditemukan');
    return template;
  }

  create(dto: CreateServiceTemplateDto) {
    return this.prisma.serviceTemplate.create({ data: dto, include: { maintenanceItem: true } });
  }

  async update(id: string, dto: UpdateServiceTemplateDto) {
    await this.findOne(id);
    return this.prisma.serviceTemplate.update({ where: { id }, data: dto, include: { maintenanceItem: true } });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.serviceTemplate.delete({ where: { id } });
    return { message: 'Template service berhasil dihapus' };
  }
}
