import { Body, Controller, Post } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { CreateAnalyticsEventDto } from './dto/create-analytics-event.dto';

@Controller('v1/analytics')
export class EventsController {
  constructor(private readonly service: AnalyticsService) {}

  @Post('events')
  create(@Body() body: CreateAnalyticsEventDto) {
    return this.service.create(body);
  }
}
