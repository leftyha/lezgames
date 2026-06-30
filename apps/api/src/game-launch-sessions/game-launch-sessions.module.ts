import { Module } from '@nestjs/common';
import { GamesModule } from '../games/games.module';
import { InventoryModule } from '../inventory/inventory.module';
import { UsersModule } from '../users/users.module';
import { WalletModule } from '../wallet/wallet.module';
import { GameLaunchSessionsController } from './game-launch-sessions.controller';
import { GameLaunchSessionsService } from './game-launch-sessions.service';

@Module({
  imports: [UsersModule, GamesModule, WalletModule, InventoryModule],
  controllers: [GameLaunchSessionsController],
  providers: [GameLaunchSessionsService],
  exports: [GameLaunchSessionsService],
})
export class GameLaunchSessionsModule {}
