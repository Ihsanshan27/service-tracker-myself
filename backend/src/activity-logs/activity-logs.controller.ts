import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { ActivityLogsService } from './activity-logs.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('activity-logs')
export class ActivityLogsController {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  @Get()
  findRecent(
    @Query('action') action?: string,
    @Query('actorId') actorId?: string,
    @Query('entityType') entityType?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('search') search?: string,
  ) {
    const parsedPage = Number(page);
    const parsedPageSize = Number(pageSize);

    return this.activityLogsService.findRecent({
      action,
      actorId,
      entityType,
      page: Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1,
      pageSize: Number.isFinite(parsedPageSize) && parsedPageSize > 0 ? Math.min(parsedPageSize, 100) : 20,
      search: search?.trim() || undefined,
    });
  }
}
