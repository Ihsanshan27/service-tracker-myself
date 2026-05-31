import { Module } from '@nestjs/common';
import { ServiceSchedulesModule } from '../service-schedules/service-schedules.module';
import { OdometerLogsController } from './odometer-logs.controller';
import { OdometerLogsService } from './odometer-logs.service';

@Module({
  imports: [ServiceSchedulesModule],
  controllers: [OdometerLogsController],
  providers: [OdometerLogsService],
})
export class OdometerLogsModule {}
