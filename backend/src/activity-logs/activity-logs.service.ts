import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type LogActivityInput = {
  actorId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  description: string;
  metadata?: Prisma.InputJsonValue;
};

type FindRecentOptions = {
  action?: string;
  actorId?: string;
  entityType?: string;
  page: number;
  pageSize: number;
  search?: string;
};

@Injectable()
export class ActivityLogsService {
  constructor(private readonly prisma: PrismaService) {}

  log(input: LogActivityInput) {
    return this.prisma.activityLog.create({
      data: {
        actorId: input.actorId,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        description: input.description,
        metadata: input.metadata,
      },
    });
  }

  async findRecent(options: FindRecentOptions) {
    const where: Prisma.ActivityLogWhereInput = {
      action: options.action || undefined,
      actorId: options.actorId || undefined,
      entityType: options.entityType || undefined,
      OR: options.search
        ? [
            { action: { contains: options.search, mode: 'insensitive' } },
            { entityType: { contains: options.search, mode: 'insensitive' } },
            { description: { contains: options.search, mode: 'insensitive' } },
            { actor: { is: { name: { contains: options.search, mode: 'insensitive' } } } },
            { actor: { is: { email: { contains: options.search, mode: 'insensitive' } } } },
          ]
        : undefined,
    };

    const [items, total] = await Promise.all([
      this.prisma.activityLog.findMany({
        where,
        skip: (options.page - 1) * options.pageSize,
        take: options.pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          actor: {
            select: { id: true, name: true, email: true, role: true },
          },
        },
      }),
      this.prisma.activityLog.count({ where }),
    ]);

    return {
      items,
      meta: {
        total,
        page: options.page,
        pageSize: options.pageSize,
        totalPages: Math.max(1, Math.ceil(total / options.pageSize)),
      },
    };
  }

  findByActor(actorId: string, limit = 20) {
    return this.prisma.activityLog.findMany({
      where: { actorId },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        actor: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });
  }
}
