import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { Role, VehicleType } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateServiceTemplateDto } from './dto/create-service-template.dto';
import { UpdateServiceTemplateDto } from './dto/update-service-template.dto';
import { ServiceTemplatesService } from './service-templates.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('service-templates')
export class ServiceTemplatesController {
  constructor(private readonly templatesService: ServiceTemplatesService) {}

  @Get()
  findAll(@Query('vehicleType') vehicleType?: VehicleType) {
    return this.templatesService.findAll(vehicleType);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.templatesService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() dto: CreateServiceTemplateDto) {
    return this.templatesService.create(dto);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateServiceTemplateDto) {
    return this.templatesService.update(id, dto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.templatesService.remove(id);
  }
}
