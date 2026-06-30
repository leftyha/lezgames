import { Module } from '@nestjs/common';
import { AntiCheatModule } from '../anti-cheat/anti-cheat.module';
import { GameLaunchSessionsModule } from '../game-launch-sessions/game-launch-sessions.module';
import { GamesModule } from '../games/games.module';
import { LeaderboardsModule } from '../leaderboards/leaderboards.module';
import { RewardsModule } from '../rewards/rewards.module';
import { UsersModule } from '../users/users.module';
import { WalletModule } from '../wallet/wallet.module';
import { ScoresController } from './scores.controller';
import { ScoresService } from './scores.service';

@Module({
  imports: [UsersModule, GamesModule, GameLaunchSessionsModule, AntiCheatModule, RewardsModule, WalletModule, LeaderboardsModule],
  controllers: [ScoresController],
  providers: [ScoresService],
})
export class ScoresModule {}
