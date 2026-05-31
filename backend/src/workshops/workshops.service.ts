import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkshopDto } from './dto/create-workshop.dto';
import { UpdateWorkshopDto } from './dto/update-workshop.dto';

@Injectable()
export class WorkshopsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: string) {
    return this.prisma.workshop.findMany({ where: { userId }, orderBy: { name: 'asc' } });
  }

  create(userId: string, dto: CreateWorkshopDto) {
    return this.prisma.workshop.create({ data: { ...dto, userId } });
  }

  async update(userId: string, id: string, dto: UpdateWorkshopDto) {
    await this.ensureAccess(userId, id);
    return this.prisma.workshop.update({ where: { id }, data: dto });
  }

  async remove(userId: string, id: string) {
    await this.ensureAccess(userId, id);
    await this.prisma.workshop.delete({ where: { id } });
    return { message: 'Bengkel berhasil dihapus' };
  }

  private async ensureAccess(userId: string, id: string) {
    const workshop = await this.prisma.workshop.findUnique({ where: { id } });
    if (!workshop) throw new NotFoundException('Bengkel tidak ditemukan');
    if (workshop.userId !== userId) throw new ForbiddenException('Akses ditolak');
  }
}
