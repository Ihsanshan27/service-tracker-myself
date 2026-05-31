import { Injectable } from '@nestjs/common';
import { DocumentStatus, ScheduleStatus, VehicleType } from '@prisma/client';
import { getDocumentStatus, getScheduleStatus, monthStartEnd } from '../common/date-status';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async userDashboard(userId: string) {
    await this.refreshUserReminderStatuses(userId);
    const { start, end } = monthStartEnd();
    const [vehicles, serviceMonth, serviceCostMonth, dueSoonSchedules, overdueSchedules, documentReminders, upcomingSchedules] =
      await Promise.all([
        this.prisma.vehicle.findMany({ where: { userId }, include: { schedules: true } }),
        this.prisma.serviceRecord.count({ where: { vehicle: { userId }, serviceDate: { gte: start, lt: end } } }),
        this.prisma.serviceRecord.aggregate({
          where: { vehicle: { userId }, serviceDate: { gte: start, lt: end } },
          _sum: { cost: true },
        }),
        this.prisma.serviceSchedule.findMany({
          where: { vehicle: { userId }, status: ScheduleStatus.DUE_SOON },
          include: { vehicle: true, maintenanceItem: true },
        }),
        this.prisma.serviceSchedule.findMany({
          where: { vehicle: { userId }, status: ScheduleStatus.OVERDUE },
          include: { vehicle: true, maintenanceItem: true },
        }),
        this.prisma.vehicleDocument.findMany({
          where: { vehicle: { userId }, status: { in: [DocumentStatus.DUE_SOON, DocumentStatus.EXPIRED] } },
          include: { vehicle: true },
          orderBy: { expiryDate: 'asc' },
        }),
        this.prisma.serviceSchedule.findMany({
          where: { vehicle: { userId } },
          include: { vehicle: true, maintenanceItem: true },
          orderBy: { nextServiceDate: 'asc' },
          take: 10,
        }),
      ]);

    const vehicleHealthScores = vehicles.map((vehicle) => {
      const overdueCount = vehicle.schedules.filter((schedule) => schedule.status === ScheduleStatus.OVERDUE).length;
      const dueSoonCount = vehicle.schedules.filter((schedule) => schedule.status === ScheduleStatus.DUE_SOON).length;
      const score = overdueCount > 1 ? 40 : overdueCount === 1 ? 60 : dueSoonCount > 0 ? 80 : 100;
      return { vehicleId: vehicle.id, vehicleName: vehicle.vehicleName, score };
    });

    const overdueCount = overdueSchedules.length;
    const healthScore = overdueCount > 1 ? 40 : overdueCount === 1 ? 60 : dueSoonSchedules.length > 0 ? 80 : 100;

    return {
      totalVehicles: vehicles.length,
      totalServiceThisMonth: serviceMonth,
      totalServiceCostThisMonth: Number(serviceCostMonth._sum.cost ?? 0),
      dueSoonVehicles: dueSoonSchedules,
      overdueVehicles: overdueSchedules,
      documentReminders,
      upcomingSchedules,
      healthScore,
      vehicleHealthScores,
    };
  }

  async adminDashboard() {
    const [totalUsers, totalVehicles, totalServiceRecords, totalMaintenanceItems, totalTemplates, latestUsers, motorCount, mobilCount] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.vehicle.count(),
        this.prisma.serviceRecord.count(),
        this.prisma.maintenanceItem.count(),
        this.prisma.serviceTemplate.count(),
        this.prisma.user.findMany({
          select: { id: true, email: true, name: true, role: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
          take: 5,
        }),
        this.prisma.vehicle.count({ where: { vehicleType: VehicleType.MOTOR } }),
        this.prisma.vehicle.count({ where: { vehicleType: VehicleType.MOBIL } }),
      ]);

    return {
      totalUsers,
      totalVehicles,
      totalServiceRecords,
      totalMaintenanceItems,
      totalTemplates,
      latestUsers,
      vehicleTypeStats: [
        { type: VehicleType.MOTOR, count: motorCount },
        { type: VehicleType.MOBIL, count: mobilCount },
      ],
    };
  }

  private async refreshUserReminderStatuses(userId: string) {
    const [schedules, documents] = await Promise.all([
      this.prisma.serviceSchedule.findMany({
        where: { vehicle: { userId } },
        include: { vehicle: { select: { currentOdometer: true } } },
      }),
      this.prisma.vehicleDocument.findMany({ where: { vehicle: { userId } } }),
    ]);

    await Promise.all([
      ...schedules.map((schedule) =>
        this.prisma.serviceSchedule.update({
          where: { id: schedule.id },
          data: {
            status: getScheduleStatus({
              nextServiceDate: schedule.nextServiceDate,
              nextServiceOdometer: schedule.nextServiceOdometer,
              currentOdometer: schedule.vehicle.currentOdometer,
            }),
          },
        }),
      ),
      ...documents.map((document) =>
        this.prisma.vehicleDocument.update({
          where: { id: document.id },
          data: { status: getDocumentStatus(document.expiryDate) },
        }),
      ),
    ]);
  }
}
