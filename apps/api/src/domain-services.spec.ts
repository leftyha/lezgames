import { describe, expect, it } from 'vitest';
import { AdsService } from './ads/ads.service';
import { AdminService } from './admin/admin.service';
import { AnalyticsService } from './analytics/analytics.service';
import { AuthService } from './auth/auth.service';
import { BugReportsService } from './bug-reports/bug-reports.service';
import { GameLaunchSessionsService } from './game-launch-sessions/game-launch-sessions.service';
import { GameVersionsService } from './game-versions/game-versions.service';
import { GamesService } from './games/games.service';
import { InventoryService } from './inventory/inventory.service';
import { LeaderboardsService } from './leaderboards/leaderboards.service';
import { QuestsService } from './quests/quests.service';
import { RewardsService } from './rewards/rewards.service';
import { ScoresService } from './scores/scores.service';
import { StoreService } from './store/store.service';
import { UsersService } from './users/users.service';
import { WalletService } from './wallet/wallet.service';

describe('Domain services wiring', () => {
  const prisma = {} as any;
  const users = new UsersService(prisma);
  const games = new GamesService(prisma);
  const wallet = new WalletService(prisma);
  const inventory = new InventoryService(prisma);
  const rewards = new RewardsService(prisma);
  const leaderboards = new LeaderboardsService(prisma);

  it('constructs core domain services', () => {
    expect(users).toBeInstanceOf(UsersService);
    expect(games).toBeInstanceOf(GamesService);
    expect(wallet).toBeInstanceOf(WalletService);
    expect(inventory).toBeInstanceOf(InventoryService);
    expect(rewards).toBeInstanceOf(RewardsService);
    expect(leaderboards).toBeInstanceOf(LeaderboardsService);
  });

  it('constructs feature domain services', () => {
    expect(new AdsService(prisma, users)).toBeInstanceOf(AdsService);
    expect(new AdminService(prisma)).toBeInstanceOf(AdminService);
    expect(new AnalyticsService(prisma, users)).toBeInstanceOf(AnalyticsService);
    expect(new AuthService(prisma, users)).toBeInstanceOf(AuthService);
    expect(new BugReportsService(prisma, users)).toBeInstanceOf(BugReportsService);
    expect(new GameVersionsService(prisma)).toBeInstanceOf(GameVersionsService);
    expect(new QuestsService(prisma)).toBeInstanceOf(QuestsService);
  });

  it('constructs composed game flow services', () => {
    const launchSessions = new GameLaunchSessionsService(prisma, users, games, wallet, inventory);
    expect(launchSessions).toBeInstanceOf(GameLaunchSessionsService);
    expect(new StoreService(prisma, users, wallet, inventory)).toBeInstanceOf(StoreService);
    expect(new ScoresService(prisma, users, games, launchSessions, {} as any, rewards, wallet, leaderboards)).toBeInstanceOf(ScoresService);
  });
});
