import 'reflect-metadata';
import { Controller, Get, Module, Param, Post, Body, BadRequestException } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

type WalletTransactionType = 'reward' | 'purchase' | 'admin_grant' | 'reversal';
type StoreCategory = 'skins' | 'trails' | 'hit_effects' | 'profile_badges' | 'frames' | 'seasonal_items';

type WalletTransaction = {
  id: string;
  userId: string;
  type: WalletTransactionType;
  amount: number;
  reason: string;
  source: string;
  auditId: string;
  createdAt: string;
};

type StoreItem = {
  id: string;
  name: string;
  category: StoreCategory;
  price: number;
  compatibleGames: string[];
  featured?: boolean;
};

type InventoryItem = {
  id: string;
  userId: string;
  storeItemId: string;
  equippedFor: string[];
};

const modules = [
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
];

const walletTransactions: WalletTransaction[] = [
  {
    id: 'wtx_reward_001',
    userId: 'demo-user',
    type: 'reward',
    amount: 450,
    reason: 'valid_score_reward',
    source: 'scores/game_1/session_demo_001',
    auditId: 'audit_wallet_001',
    createdAt: '2026-06-29T00:00:00.000Z',
  },
  {
    id: 'wtx_purchase_001',
    userId: 'demo-user',
    type: 'purchase',
    amount: -250,
    reason: 'cosmetic_purchase',
    source: 'store/item_violet_umbrella',
    auditId: 'audit_wallet_002',
    createdAt: '2026-06-29T00:05:00.000Z',
  },
  {
    id: 'wtx_admin_001',
    userId: 'demo-user',
    type: 'admin_grant',
    amount: 12000,
    reason: 'mvp_seed_balance',
    source: 'admin/bootstrap',
    auditId: 'audit_wallet_003',
    createdAt: '2026-06-29T00:10:00.000Z',
  },
];

const storeItems: StoreItem[] = [
  { id: 'item_violet_umbrella', name: 'Violet Umbrella', category: 'skins', price: 250, compatibleGames: ['golden-rain-zombies', 'zombie-umbrella-run'], featured: true },
  { id: 'item_zombie_egg', name: 'Zombie Egg Skin', category: 'skins', price: 500, compatibleGames: ['huevo-no-te-quiebres', 'egg-catch-me', 'egg-vs-moon'] },
  { id: 'item_amber_rain', name: 'Amber Rain Trail', category: 'trails', price: 750, compatibleGames: ['gravity-dungeon-dash', 'cell-front-lite'], featured: true },
  { id: 'item_glitch_frame', name: 'Glitch Frame', category: 'frames', price: 1000, compatibleGames: ['break-me', 'glitch-maze-beta'] },
];

const inventoryItems: InventoryItem[] = [
  { id: 'inv_001', userId: 'demo-user', storeItemId: 'item_violet_umbrella', equippedFor: ['golden-rain-zombies'] },
  { id: 'inv_002', userId: 'demo-user', storeItemId: 'item_amber_rain', equippedFor: [] },
];

const rewardCaps = [
  { gameSlug: 'golden-rain-zombies', baseCoins: 15, dailyCap: 250, earnedToday: 45 },
  { gameSlug: 'huevo-no-te-quiebres', baseCoins: 16, dailyCap: 250, earnedToday: 32 },
  { gameSlug: 'break-me', baseCoins: 17, dailyCap: 250, earnedToday: 0 },
];

function getWallet(userId: string) {
  const transactions = walletTransactions.filter((transaction) => transaction.userId === userId);
  const balance = transactions.reduce((total, transaction) => total + transaction.amount, 0);

  return {
    userId,
    balance,
    currency: 'LC',
    disclaimer: 'Lez Coins are internal credits only and cannot be withdrawn, sold, transferred or exchanged for real money.',
    calculatedServerSide: true,
    transactions,
  };
}

@Controller('v1')
class ApiController {
  @Get('health')
  health() {
    return { ok: true, service: 'lezgamez-api' };
  }

  @Get('modules')
  list() {
    return { modules, rule: 'client never decides wallet, rewards, scores or transactions' };
  }

  @Get('wallet/:userId')
  wallet(@Param('userId') userId: string) {
    return getWallet(userId);
  }

  @Get('wallet/:userId/transactions')
  walletLedger(@Param('userId') userId: string) {
    return { userId, transactions: getWallet(userId).transactions };
  }

  @Get('store/items')
  store() {
    return { items: storeItems, categories: ['skins', 'trails', 'hit_effects', 'profile_badges', 'frames', 'seasonal_items'] };
  }

  @Get('inventory/:userId')
  inventory(@Param('userId') userId: string) {
    const owned = inventoryItems
      .filter((item) => item.userId === userId)
      .map((inventoryItem) => ({ ...inventoryItem, item: storeItems.find((storeItem) => storeItem.id === inventoryItem.storeItemId) }));

    return { userId, owned };
  }

  @Get('rewards/caps')
  rewards() {
    return { caps: rewardCaps, rule: 'rewards are capped per user, per game and per UTC day' };
  }

  @Post('store/purchase')
  purchase(@Body() body: { userId?: string; itemId?: string; gameSlug?: string }) {
    const userId = body.userId ?? 'demo-user';
    const item = storeItems.find((storeItem) => storeItem.id === body.itemId);

    if (!item) {
      throw new BadRequestException('Unknown store item.');
    }

    if (body.gameSlug && !item.compatibleGames.includes(body.gameSlug)) {
      throw new BadRequestException('Item is not compatible with this game.');
    }

    const wallet = getWallet(userId);
    if (wallet.balance < item.price) {
      throw new BadRequestException('Insufficient Lez Coins balance.');
    }

    return {
      approved: true,
      serverValidated: true,
      purchase: { userId, itemId: item.id, price: item.price, createsWalletTransaction: true, createsInventoryItem: true },
    };
  }
}

@Module({ controllers: [ApiController] })
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT || 4000);
}

bootstrap();
