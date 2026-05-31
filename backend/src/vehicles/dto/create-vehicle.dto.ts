import { VehicleType } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  vehicleName: string;

  @IsEnum(VehicleType)
  vehicleType: VehicleType;

  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsInt()
  @Min(1900)
  year: number;

  @IsString()
  plateNumber: string;

  @IsInt()
  @Min(0)
  currentOdometer: number;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
