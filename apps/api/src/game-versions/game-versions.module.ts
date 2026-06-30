import { Module } from '@nestjs/common';
import { VersionsController } from './versions.controller';
import { GameVersionsService } from './game-versions.service';

@Module({
  controllers: [VersionsController],
  providers: [GameVersionsService],
  exports: [GameVersionsService],
})
export class GameVersionsModule {}
