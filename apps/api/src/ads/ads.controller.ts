import { Body, Controller, Post } from '@nestjs/common';
import { AdsService } from './ads.service';
import { CreateAdEventDto } from './dto/create-ad-event.dto';

@Controller('v1/ads')
export class AdsController {
  constructor(private readonly ads: AdsService) {}

  @Post('events')
  createEvent(@Body() body: CreateAdEventDto) {
    return this.ads.createEvent(body);
  }
}
