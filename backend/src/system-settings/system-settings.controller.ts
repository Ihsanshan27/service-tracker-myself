import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { AuthUser, CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UpdateSystemSettingDto } from './dto/update-system-setting.dto';
import { SystemSettingsService } from './system-settings.service';

@Controller('system-settings')
export class SystemSettingsController {
  constructor(
    private readonly systemSettingsService: SystemSettingsService,
    private readonly activityLogs: ActivityLogsService,
  ) {}

  @Get('public')
  getPublicSettings() {
    return this.systemSettingsService.getPublicSettings();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  getSettings() {
    return this.systemSettingsService.getSettings();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch()
  async updateSettings(@CurrentUser() user: AuthUser, @Body() dto: UpdateSystemSettingDto) {
    const settings = await this.systemSettingsService.updateSettings(dto);
    await this.activityLogs.log({
      actorId: user.id,
      action: 'SYSTEM_SETTINGS_UPDATED',
      entityType: 'SYSTEM_SETTING',
      entityId: settings.id,
      description: `Pengaturan sistem diperbarui oleh ${user.email}`,
      metadata: { allowPublicRegistration: settings.allowPublicRegistration },
    });
    return settings;
  }
}
