import { Controller, Get, Query } from '@nestjs/common';
import { GameVersionsService } from './game-versions.service';

@Controller('v1/game-versions')
export class VersionsController {
  constructor(private readonly service: GameVersionsService) {}

  @Get()
  async list(@Query('gameSlug') gameSlug?: string) {
    return { versions: await this.service.list(gameSlug) };
  }
}
