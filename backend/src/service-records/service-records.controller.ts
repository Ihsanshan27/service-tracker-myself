import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser, AuthUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateServiceRecordDto } from './dto/create-service-record.dto';
import { UpdateServiceRecordDto } from './dto/update-service-record.dto';
import { ServiceRecordsService } from './service-records.service';

@UseGuards(JwtAuthGuard)
@Controller('service-records')
export class ServiceRecordsController {
  constructor(private readonly recordsService: ServiceRecordsService) {}

  @Get()
  findAll(
    @CurrentUser() user: AuthUser,
    @Query('vehicleId') vehicleId?: string,
    @Query('maintenanceItemId') maintenanceItemId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.recordsService.findAll(user.id, user.role as never, { vehicleId, maintenanceItemId, from, to });
  }

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateServiceRecordDto) {
    return this.recordsService.create(user.id, dto);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.recordsService.findOne(user.id, user.role as never, id);
  }

  @Patch(':id')
  update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: UpdateServiceRecordDto) {
    return this.recordsService.update(user.id, user.role as never, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.recordsService.remove(user.id, user.role as never, id);
  }
}
