import { PartialType } from '@nestjs/mapped-types';
import { IsInt, Min } from 'class-validator';
import { CreateVehicleDto } from './create-vehicle.dto';

export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {}

export class UpdateVehicleOdometerDto {
  @IsInt()
  @Min(0)
  odometer: number;
}
