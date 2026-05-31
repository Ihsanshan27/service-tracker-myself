import { VehicleType } from '@prisma/client';
import { IsEnum, IsInt, IsString, Min } from 'class-validator';

export class CreateServiceTemplateDto {
  @IsEnum(VehicleType)
  vehicleType: VehicleType;

  @IsString()
  maintenanceItemId: string;

  @IsInt()
  @Min(0)
  intervalKm: number;

  @IsInt()
  @Min(0)
  intervalMonth: number;
}
