import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSystemSettingDto } from './dto/update-system-setting.dto';

@Injectable()
export class SystemSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings() {
    return this.prisma.systemSetting.upsert({
      where: { id: 'global' },
      update: {},
      create: { id: 'global', allowPublicRegistration: true },
    });
  }

  async getPublicSettings() {
    const settings = await this.getSettings();
    return {
      allowPublicRegistration: settings.allowPublicRegistration,
    };
  }

  async updateSettings(dto: UpdateSystemSettingDto) {
    return this.prisma.systemSetting.upsert({
      where: { id: 'global' },
      update: { allowPublicRegistration: dto.allowPublicRegistration },
      create: {
        id: 'global',
        allowPublicRegistration: dto.allowPublicRegistration,
      },
    });
  }
}
