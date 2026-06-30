import { Controller, Get } from '@nestjs/common';
import { QuestsService } from './quests.service';

@Controller('v1/quests')
export class QuestsController {
  constructor(private readonly quests: QuestsService) {}

  @Get()
  list() {
    return this.quests.listActive();
  }
}
