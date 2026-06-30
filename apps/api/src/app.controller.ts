import { Controller, Get } from '@nestjs/common';

@Controller('v1')
export class AppController {
  @Get('health')
  health() {
    return { ok: true, service: 'lezgamez-api', persistence: 'postgresql-prisma', runtime: ['redis-rate-limit', 'session-auth', 'role-guards'], architecture: 'modular-nest-domains' };
  }

  @Get('modules')
  modules() {
    return {
      rule: 'client never decides wallet, rewards, scores or transactions',
      runtimeState: 'persistent database, Redis rate limit, domain services and controllers',
      implemented: [
        'AuthModule',
        'UsersModule',
        'GamesModule',
        'GameVersionsModule',
        'GameLaunchSessionsModule',
        'ScoresModule',
        'LeaderboardsModule',
        'AntiCheatModule',
        'WalletModule',
        'InventoryModule',
        'StoreModule',
        'RewardsModule',
        'AdsModule',
        'AnalyticsModule',
        'AdminModule',
        'RedisModule',
        'RateLimitMiddleware',
        'AuthGuard',
        'RolesGuard',
      ],
      intentionallyDeferred: ['PaymentsModule until paid internal credits/cosmetics are approved'],
      pending: ['signed score tokens', 'production backup execution', 'external ad network reporting reconciliation'],
    };
  }
}
