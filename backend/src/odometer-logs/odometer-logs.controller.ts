import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser, AuthUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateOdometerLogDto } from './dto/create-odometer-log.dto';
import { OdometerLogsService } from './odometer-logs.service';

@UseGuards(JwtAuthGuard)
@Controller('odometer-logs')
export class OdometerLogsController {
  constructor(private readonly logsService: OdometerLogsService) {}

  @Get('vehicle/:vehicleId')
  findByVehicle(@CurrentUser() user: AuthUser, @Param('vehicleId') vehicleId: string) {
    return this.logsService.findByVehicle(user.id, user.role as never, vehicleId);
  }

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateOdometerLogDto) {
    return this.logsService.create(user.id, user.role as never, dto);
  }
}
