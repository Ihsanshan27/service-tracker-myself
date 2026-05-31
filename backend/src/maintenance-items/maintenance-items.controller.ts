import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { Role, VehicleType } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateMaintenanceItemDto } from './dto/create-maintenance-item.dto';
import { UpdateMaintenanceItemDto } from './dto/update-maintenance-item.dto';
import { MaintenanceItemsService } from './maintenance-items.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('maintenance-items')
export class MaintenanceItemsController {
  constructor(private readonly itemsService: MaintenanceItemsService) {}

  @Get()
  findAll(@Query('vehicleType') vehicleType?: VehicleType) {
    return this.itemsService.findAll(vehicleType);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() dto: CreateMaintenanceItemDto) {
    return this.itemsService.create(dto);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMaintenanceItemDto) {
    return this.itemsService.update(id, dto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemsService.remove(id);
  }
}
