import { Controller, Get } from '@nestjs/common';

@Controller('v1')
export class AppController {
  @Get('health')
  health() {
    return { ok: true, service: 'lezgamez-api', persistence: 'postgresql-prisma', architecture: 'modular-nest-domains' };
  }

  @Get('modules')
  modules() {
    return {
      rule: 'client never decides wallet, rewards, scores or transactions',
      runtimeState: 'persistent database, domain services and controllers',
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
      ],
      intentionallyDeferred: ['PaymentsModule until paid internal credits/cosmetics are approved'],
      pending: ['auth guards', 'admin permissions', 'Redis rate limit', 'signed score tokens', 'integration tests against a real test database'],
    };
  }
}
