import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceTemplateDto } from './create-service-template.dto';

export class UpdateServiceTemplateDto extends PartialType(CreateServiceTemplateDto) {}
