import { Module } from '@nestjs/common';
import { ServiceSchedulesModule } from '../service-schedules/service-schedules.module';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';

@Module({
  imports: [ServiceSchedulesModule],
  controllers: [VehiclesController],
  providers: [VehiclesService],
})
export class VehiclesModule {}
