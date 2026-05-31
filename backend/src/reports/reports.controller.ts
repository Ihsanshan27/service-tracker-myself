import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CurrentUser, AuthUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ReportsService } from './reports.service';

@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('service-cost')
  serviceCost(@CurrentUser() user: AuthUser, @Query('vehicleId') vehicleId?: string, @Query('from') from?: string, @Query('to') to?: string) {
    return this.reportsService.serviceCost(user.id, { vehicleId, from, to });
  }

  @Get('service-cost/monthly')
  monthly(@CurrentUser() user: AuthUser, @Query('vehicleId') vehicleId?: string, @Query('from') from?: string, @Query('to') to?: string) {
    return this.reportsService.monthly(user.id, { vehicleId, from, to });
  }

  @Get('service-cost/by-vehicle')
  byVehicle(@CurrentUser() user: AuthUser, @Query('vehicleId') vehicleId?: string, @Query('from') from?: string, @Query('to') to?: string) {
    return this.reportsService.byVehicle(user.id, { vehicleId, from, to });
  }

  @Get('service-cost/by-maintenance-item')
  byMaintenanceItem(@CurrentUser() user: AuthUser, @Query('vehicleId') vehicleId?: string, @Query('from') from?: string, @Query('to') to?: string) {
    return this.reportsService.byMaintenanceItem(user.id, { vehicleId, from, to });
  }
}
