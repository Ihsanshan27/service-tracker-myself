import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser, AuthUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateVehicleDocumentDto } from './dto/create-vehicle-document.dto';
import { UpdateVehicleDocumentDto } from './dto/update-vehicle-document.dto';
import { VehicleDocumentsService } from './vehicle-documents.service';

@UseGuards(JwtAuthGuard)
@Controller('vehicle-documents')
export class VehicleDocumentsController {
  constructor(private readonly docsService: VehicleDocumentsService) {}

  @Get('vehicle/:vehicleId')
  findByVehicle(@CurrentUser() user: AuthUser, @Param('vehicleId') vehicleId: string) {
    return this.docsService.findByVehicle(user.id, user.role as never, vehicleId);
  }

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateVehicleDocumentDto) {
    return this.docsService.create(user.id, user.role as never, dto);
  }

  @Patch(':id')
  update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: UpdateVehicleDocumentDto) {
    return this.docsService.update(user.id, user.role as never, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.docsService.remove(user.id, user.role as never, id);
  }
}
