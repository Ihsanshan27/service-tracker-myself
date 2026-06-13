import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activityLogs: ActivityLogsService,
  ) {}

  findAll() {
    return this.prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, createdAt: true, _count: { select: { vehicles: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: CreateUserDto, actorId?: string) {
    const email = dto.email.toLowerCase();
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('Email sudah terdaftar');

    const password = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email,
        password,
        role: dto.role ?? Role.USER,
      },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });

    await this.activityLogs.log({
      actorId,
      action: 'USER_CREATED',
      entityType: 'USER',
      entityId: user.id,
      description: `User ${user.email} dibuat oleh admin`,
      metadata: { role: user.role },
    });

    return user;
  }

  async update(id: string, dto: UpdateUserDto, actorId?: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User tidak ditemukan');

    const email = dto.email?.toLowerCase();
    if (email && email !== user.email) {
      const existing = await this.prisma.user.findUnique({ where: { email } });
      if (existing) throw new ConflictException('Email sudah terdaftar');
    }

    const password = dto.password ? await bcrypt.hash(dto.password, 12) : undefined;
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        name: dto.name,
        email,
        password,
        role: dto.role,
      },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });

    await this.activityLogs.log({
      actorId,
      action: 'USER_UPDATED',
      entityType: 'USER',
      entityId: updatedUser.id,
      description: `User ${updatedUser.email} diperbarui oleh admin`,
      metadata: { role: updatedUser.role, passwordChanged: Boolean(password) },
    });

    return updatedUser;
  }

  async remove(id: string, actorId?: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User tidak ditemukan');
    await this.prisma.user.delete({ where: { id } });

    await this.activityLogs.log({
      actorId,
      action: 'USER_DELETED',
      entityType: 'USER',
      entityId: id,
      description: `User ${user.email} dihapus oleh admin`,
      metadata: { email: user.email, role: user.role },
    });

    return { message: 'User berhasil dihapus' };
  }
}
