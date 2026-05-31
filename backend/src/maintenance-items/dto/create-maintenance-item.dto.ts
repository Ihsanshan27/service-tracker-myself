import { VehicleType } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateMaintenanceItemDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(0)
  defaultIntervalKm: number;

  @IsInt()
  @Min(0)
  defaultIntervalMonth: number;

  @IsEnum(VehicleType)
  vehicleType: VehicleType;
}
