import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { getDocumentStatus } from '../common/date-status';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleDocumentDto } from './dto/create-vehicle-document.dto';
import { UpdateVehicleDocumentDto } from './dto/update-vehicle-document.dto';

@Injectable()
export class VehicleDocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, role: Role, dto: CreateVehicleDocumentDto) {
    await this.ensureVehicleAccess(userId, role, dto.vehicleId);
    return this.prisma.vehicleDocument.create({
      data: { ...dto, status: getDocumentStatus(dto.expiryDate) },
    });
  }

  async findByVehicle(userId: string, role: Role, vehicleId: string) {
    await this.ensureVehicleAccess(userId, role, vehicleId);
    const docs = await this.prisma.vehicleDocument.findMany({ where: { vehicleId }, orderBy: { expiryDate: 'asc' } });
    await Promise.all(
      docs.map((doc) =>
        this.prisma.vehicleDocument.update({
          where: { id: doc.id },
          data: { status: getDocumentStatus(doc.expiryDate) },
        }),
      ),
    );
    return this.prisma.vehicleDocument.findMany({ where: { vehicleId }, orderBy: { expiryDate: 'asc' } });
  }

  async update(userId: string, role: Role, id: string, dto: UpdateVehicleDocumentDto) {
    const doc = await this.findOne(userId, role, id);
    if (dto.vehicleId && dto.vehicleId !== doc.vehicleId) await this.ensureVehicleAccess(userId, role, dto.vehicleId);
    return this.prisma.vehicleDocument.update({
      where: { id },
      data: { ...dto, status: getDocumentStatus(dto.expiryDate ?? doc.expiryDate) },
    });
  }

  async remove(userId: string, role: Role, id: string) {
    await this.findOne(userId, role, id);
    await this.prisma.vehicleDocument.delete({ where: { id } });
    return { message: 'Dokumen berhasil dihapus' };
  }

  private async findOne(userId: string, role: Role, id: string) {
    const doc = await this.prisma.vehicleDocument.findUnique({ where: { id }, include: { vehicle: true } });
    if (!doc) throw new NotFoundException('Dokumen tidak ditemukan');
    if (role !== Role.ADMIN && doc.vehicle.userId !== userId) throw new ForbiddenException('Akses ditolak');
    return doc;
  }

  private async ensureVehicleAccess(userId: string, role: Role, vehicleId: string) {
    const vehicle = await this.prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) throw new NotFoundException('Kendaraan tidak ditemukan');
    if (role !== Role.ADMIN && vehicle.userId !== userId) throw new ForbiddenException('Akses ditolak');
  }
}
