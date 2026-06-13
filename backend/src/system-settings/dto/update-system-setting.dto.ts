import { IsBoolean } from 'class-validator';

export class UpdateSystemSettingDto {
  @IsBoolean()
  allowPublicRegistration: boolean;
}
