import { Module } from '@nestjs/common';
import { ServiceSchedulesModule } from '../service-schedules/service-schedules.module';
import { ServiceRecordsController } from './service-records.controller';
import { ServiceRecordsService } from './service-records.service';

@Module({
  imports: [ServiceSchedulesModule],
  controllers: [ServiceRecordsController],
  providers: [ServiceRecordsService],
})
export class ServiceRecordsModule {}
