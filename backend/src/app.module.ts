import { Module } from '@nestjs/common';
import { IpLocationController } from './ip-location.controller';
import { IpLocationService } from './ip-location.service';

@Module({
  controllers: [IpLocationController],
  providers: [IpLocationService],
})
export class AppModule {}
