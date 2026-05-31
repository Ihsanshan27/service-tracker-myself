import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type ReportFilters = { vehicleId?: string; from?: string; to?: string };

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async serviceCost(userId: string, filters: ReportFilters) {
    const where = this.where(userId, filters);
    const [total, records] = await Promise.all([
      this.prisma.serviceRecord.aggregate({ where, _sum: { cost: true }, _count: true }),
      this.prisma.serviceRecord.findMany({
        where,
        include: { vehicle: true, maintenanceItem: true },
        orderBy: { serviceDate: 'desc' },
      }),
    ]);
    return { totalCost: Number(total._sum.cost ?? 0), totalRecords: total._count, records };
  }

  async monthly(userId: string, filters: ReportFilters) {
    const rows = await this.prisma.serviceRecord.findMany({
      where: this.where(userId, filters),
      select: { serviceDate: true, cost: true },
    });
    return this.group(rows, (row) => row.serviceDate.toISOString().slice(0, 7));
  }

  async byVehicle(userId: string, filters: ReportFilters) {
    const rows = await this.prisma.serviceRecord.findMany({
      where: this.where(userId, filters),
      include: { vehicle: true },
    });
    return this.group(rows, (row) => row.vehicle.vehicleName);
  }

  async byMaintenanceItem(userId: string, filters: ReportFilters) {
    const rows = await this.prisma.serviceRecord.findMany({
      where: this.where(userId, filters),
      include: { maintenanceItem: true },
    });
    return this.group(rows, (row) => row.maintenanceItem.name);
  }

  private where(userId: string, filters: ReportFilters): Prisma.ServiceRecordWhereInput {
    return {
      vehicle: { userId },
      vehicleId: filters.vehicleId,
      serviceDate:
        filters.from || filters.to
          ? { gte: filters.from ? new Date(filters.from) : undefined, lte: filters.to ? new Date(filters.to) : undefined }
          : undefined,
    };
  }

  private group<T extends { cost: Prisma.Decimal }>(rows: T[], keyFn: (row: T) => string) {
    const map = new Map<string, { label: string; totalCost: number; count: number }>();
    rows.forEach((row) => {
      const label = keyFn(row);
      const current = map.get(label) ?? { label, totalCost: 0, count: 0 };
      current.totalCost += Number(row.cost);
      current.count += 1;
      map.set(label, current);
    });
    return Array.from(map.values()).sort((a, b) => b.totalCost - a.totalCost);
  }
}
