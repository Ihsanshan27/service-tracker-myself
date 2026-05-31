import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ScheduleStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';
import { CurrentUser, AuthUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ServiceSchedulesService } from './service-schedules.service';

class UpdateScheduleStatusDto {
  @IsEnum(ScheduleStatus)
  status: ScheduleStatus;
}

@UseGuards(JwtAuthGuard)
@Controller('service-schedules')
export class ServiceSchedulesController {
  constructor(private readonly schedulesService: ServiceSchedulesService) {}

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.schedulesService.findAll(user.id, user.role as never);
  }

  @Get('vehicle/:vehicleId')
  findByVehicle(@CurrentUser() user: AuthUser, @Param('vehicleId') vehicleId: string) {
    return this.schedulesService.findByVehicle(user.id, user.role as never, vehicleId);
  }

  @Post('generate/:vehicleId')
  generate(@CurrentUser() user: AuthUser, @Param('vehicleId') vehicleId: string) {
    return this.schedulesService.generateFromTemplate(vehicleId, user.id);
  }

  @Patch(':id/status')
  updateStatus(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: UpdateScheduleStatusDto) {
    return this.schedulesService.updateStatus(user.id, user.role as never, id, dto.status);
  }
}
