import { Type } from 'class-transformer';
import { IsDate, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateServiceRecordDto {
  @IsString()
  vehicleId: string;

  @IsString()
  maintenanceItemId: string;

  @Type(() => Date)
  @IsDate()
  serviceDate: Date;

  @IsInt()
  @Min(0)
  odometerAtService: number;

  @IsString()
  workshopName: string;

  @IsNumber()
  @Min(0)
  cost: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  invoiceImageUrl?: string;
}
