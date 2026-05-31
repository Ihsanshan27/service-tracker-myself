import { Type } from 'class-transformer';
import { IsDate, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateOdometerLogDto {
  @IsString()
  vehicleId: string;

  @IsInt()
  @Min(0)
  odometer: number;

  @Type(() => Date)
  @IsDate()
  recordedAt: Date;

  @IsOptional()
  @IsString()
  notes?: string;
}
