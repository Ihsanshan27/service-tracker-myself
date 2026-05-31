import { DocumentType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateVehicleDocumentDto {
  @IsString()
  vehicleId: string;

  @IsEnum(DocumentType)
  documentType: DocumentType;

  @IsString()
  documentName: string;

  @IsOptional()
  @IsString()
  documentNumber?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expiryDate?: Date;

  @IsOptional()
  @IsString()
  fileUrl?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
