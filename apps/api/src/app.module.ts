import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AdsModule } from './ads/ads.module';
import { AdminModule } from './admin/admin.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { BugReportsModule } from './bug-reports/bug-reports.module';
import { GameLaunchSessionsModule } from './game-launch-sessions/game-launch-sessions.module';
import { GameVersionsModule } from './game-versions/game-versions.module';
import { GamesModule } from './games/games.module';
import { InventoryModule } from './inventory/inventory.module';
import { LeaderboardsModule } from './leaderboards/leaderboards.module';
import { PrismaModule } from './prisma.module';
import { QuestsModule } from './quests/quests.module';
import { RateLimitMiddleware } from './rate-limit/rate-limit.middleware';
import { RedisModule } from './redis/redis.module';
import { RewardsModule } from './rewards/rewards.module';
import { ScoresModule } from './scores/scores.module';
import { StoreModule } from './store/store.module';
import { UsersModule } from './users/users.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [RedisModule, PrismaModule, AuthModule, UsersModule, GamesModule, GameVersionsModule, GameLaunchSessionsModule, ScoresModule, LeaderboardsModule, WalletModule, InventoryModule, StoreModule, RewardsModule, AdsModule, AnalyticsModule, AdminModule, BugReportsModule, QuestsModule],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimitMiddleware).forRoutes('*');
  }
}
