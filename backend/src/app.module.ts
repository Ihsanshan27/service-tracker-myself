import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { HealthModule } from './health/health.module';
import { MaintenanceItemsModule } from './maintenance-items/maintenance-items.module';
import { OdometerLogsModule } from './odometer-logs/odometer-logs.module';
import { PrismaModule } from './prisma/prisma.module';
import { ReportsModule } from './reports/reports.module';
import { ServiceRecordsModule } from './service-records/service-records.module';
import { ServiceSchedulesModule } from './service-schedules/service-schedules.module';
import { ServiceTemplatesModule } from './service-templates/service-templates.module';
import { UsersModule } from './users/users.module';
import { VehicleDocumentsModule } from './vehicle-documents/vehicle-documents.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { WorkshopsModule } from './workshops/workshops.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    VehiclesModule,
    MaintenanceItemsModule,
    ServiceTemplatesModule,
    ServiceRecordsModule,
    ServiceSchedulesModule,
    OdometerLogsModule,
    WorkshopsModule,
    VehicleDocumentsModule,
    ReportsModule,
    DashboardModule,
  ],
})
export class AppModule {}
