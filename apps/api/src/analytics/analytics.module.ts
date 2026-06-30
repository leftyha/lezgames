import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { EventsController } from './events.controller';
import { AnalyticsService } from './analytics.service';

@Module({
  imports: [UsersModule],
  controllers: [EventsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
