import 'reflect-metadata';
import { Body, BadRequestException, Controller, Get, Module, Param, Post } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

type WalletTransactionType = 'reward' | 'purchase' | 'admin_grant' | 'reversal';
type StoreCategory = 'skins' | 'trails' | 'hit_effects' | 'profile_badges' | 'frames' | 'seasonal_items';
type LaunchSessionStatus = 'created' | 'started' | 'completed' | 'rejected';

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

type GameCatalogEntry = {
  slug: string;
  title: string;
  category: string;
  isPlayable: boolean;
  gameUrl: string;
  rewardRules: { baseCoins: number; dailyCap: number };
  adRules: { interstitialEveryDeaths: number; banner: boolean };
};

type LaunchSession = {
  id: string;
  userId: string;
  gameSlug: string;
  status: LaunchSessionStatus;
  sessionToken: string;
  deviceType: string;
  adblockStatus: 'unknown' | 'clear' | 'blocked';
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
};

type ScoreRecord = {
  id: string;
  userId: string;
  gameSlug: string;
  launchSessionId: string;
  score: number;
  reason: string;
  coins: number;
  accepted: boolean;
  createdAt: string;
};

type AnalyticsEvent = {
  id: string;
  name: string;
  userId: string;
  gameSlug?: string;
  launchSessionId?: string;
  payload?: Record<string, unknown>;
  createdAt: string;
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

const gameCatalog: GameCatalogEntry[] = [
  { slug: 'golden-rain-zombies', title: 'Golden Rain Zombies', category: 'zombie', isPlayable: true, gameUrl: '/games-builds/golden-rain-zombies/index.html', rewardRules: { baseCoins: 15, dailyCap: 250 }, adRules: { interstitialEveryDeaths: 3, banner: true } },
  { slug: 'huevo-no-te-quiebres', title: 'Huevo No Te Quiebres', category: 'egg', isPlayable: true, gameUrl: '/games-builds/huevo-no-te-quiebres/index.html', rewardRules: { baseCoins: 16, dailyCap: 250 }, adRules: { interstitialEveryDeaths: 3, banner: true } },
  { slug: 'break-me', title: 'Break Me', category: 'puzzle', isPlayable: true, gameUrl: '/games-builds/break-me/index.html', rewardRules: { baseCoins: 17, dailyCap: 250 }, adRules: { interstitialEveryDeaths: 3, banner: true } },
  { slug: 'cell-front-lite', title: 'Cell Front Lite', category: 'io', isPlayable: true, gameUrl: '/games-builds/cell-front-lite/index.html', rewardRules: { baseCoins: 18, dailyCap: 250 }, adRules: { interstitialEveryDeaths: 3, banner: true } },
  { slug: 'egg-catch-me', title: 'Egg Catch Me', category: 'egg', isPlayable: true, gameUrl: '/games-builds/egg-catch-me/index.html', rewardRules: { baseCoins: 19, dailyCap: 250 }, adRules: { interstitialEveryDeaths: 3, banner: true } },
  { slug: 'gravity-dungeon-dash', title: 'Gravity Dungeon Dash', category: 'arcade', isPlayable: true, gameUrl: '/games-builds/gravity-dungeon-dash/index.html', rewardRules: { baseCoins: 20, dailyCap: 250 }, adRules: { interstitialEveryDeaths: 3, banner: true } },
  { slug: 'zombie-umbrella-run', title: 'Zombie Umbrella Run', category: 'zombie', isPlayable: true, gameUrl: '/games-builds/zombie-umbrella-run/index.html', rewardRules: { baseCoins: 21, dailyCap: 250 }, adRules: { interstitialEveryDeaths: 3, banner: true } },
  { slug: 'weird-death-button', title: 'Weird Death Button', category: 'weird', isPlayable: true, gameUrl: '/games-builds/weird-death-button/index.html', rewardRules: { baseCoins: 22, dailyCap: 250 }, adRules: { interstitialEveryDeaths: 3, banner: true } },
  { slug: 'physics-skull-drop', title: 'Physics Skull Drop', category: 'physics', isPlayable: true, gameUrl: '/games-builds/physics-skull-drop/index.html', rewardRules: { baseCoins: 23, dailyCap: 250 }, adRules: { interstitialEveryDeaths: 3, banner: true } },
  { slug: 'egg-vs-moon', title: 'Egg vs Moon', category: 'arcade', isPlayable: true, gameUrl: '/games-builds/egg-vs-moon/index.html', rewardRules: { baseCoins: 24, dailyCap: 250 }, adRules: { interstitialEveryDeaths: 3, banner: true } },
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

const launchSessions: LaunchSession[] = [];
const scores: ScoreRecord[] = [];
const analyticsEvents: AnalyticsEvent[] = [];

function now() {
  return new Date().toISOString();
}

function makeId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function getGame(gameSlug: string) {
  return gameCatalog.find((game) => game.slug === gameSlug);
}

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

function getOwnedInventory(userId: string) {
  return inventoryItems
    .filter((item) => item.userId === userId)
    .map((inventoryItem) => ({ ...inventoryItem, item: storeItems.find((storeItem) => storeItem.id === inventoryItem.storeItemId) }));
}

function buildScoreChecksum(launchSessionId: string, score: number) {
  return Buffer.from(`${launchSessionId}:${score}:lezgamez-mvp`).toString('base64url');
}

function getRewardCap(gameSlug: string, baseCoins: number) {
  let cap = rewardCaps.find((rewardCap) => rewardCap.gameSlug === gameSlug);

  if (!cap) {
    cap = { gameSlug, baseCoins, dailyCap: 250, earnedToday: 0 };
    rewardCaps.push(cap);
  }

  return cap;
}

function calculateReward(game: GameCatalogEntry, score: number) {
  const cap = getRewardCap(game.slug, game.rewardRules.baseCoins);
  const requested = game.rewardRules.baseCoins + Math.floor(score / 5000);
  const remaining = Math.max(0, cap.dailyCap - cap.earnedToday);
  return Math.min(requested, remaining);
}

@Controller('v1')
class ApiController {
  @Get('health')
  health() {
    return { ok: true, service: 'lezgamez-api' };
  }

  @Get('modules')
  list() {
    return {
      modules,
      rule: 'client never decides wallet, rewards, scores or transactions',
      implementedNow: ['GameLaunchSessions mock', 'Scores mock validation', 'Wallet ledger mutation', 'Store purchase mutation', 'Analytics event intake'],
    };
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
    return { userId, owned: getOwnedInventory(userId) };
  }

  @Get('rewards/caps')
  rewards() {
    return { caps: rewardCaps, rule: 'rewards are capped per user, per game and per UTC day' };
  }

  @Post('launch-sessions')
  createLaunchSession(@Body() body: { userId?: string; gameSlug?: string; deviceType?: string; language?: string; adblockStatus?: 'unknown' | 'clear' | 'blocked' }) {
    const userId = body.userId ?? 'demo-user';
    const gameSlug = body.gameSlug;

    if (!gameSlug) {
      throw new BadRequestException('gameSlug is required.');
    }

    const game = getGame(gameSlug);
    if (!game || !game.isPlayable) {
      throw new BadRequestException('Game is not playable.');
    }

    if (body.adblockStatus === 'blocked') {
      throw new BadRequestException('Adblock detected. LezGamez is free because ads keep the games online. Please disable your adblocker to play.');
    }

    const session: LaunchSession = {
      id: makeId('launch'),
      userId,
      gameSlug,
      status: 'created',
      sessionToken: makeId('session_token'),
      deviceType: body.deviceType ?? 'unknown',
      adblockStatus: body.adblockStatus ?? 'clear',
      createdAt: now(),
    };

    launchSessions.push(session);

    return {
      launchSessionId: session.id,
      sessionToken: session.sessionToken,
      gameUrl: game.gameUrl,
      game,
      context: {
        userId,
        language: body.language ?? 'en',
        deviceType: session.deviceType,
        walletBalance: getWallet(userId).balance,
        inventory: getOwnedInventory(userId),
        equippedItems: {},
        adStatus: 'ready',
        adblockStatus: session.adblockStatus,
        sessionToken: session.sessionToken,
        launchSessionId: session.id,
        gameConfig: {
          scoreChecksumHint: 'checksum = base64url(`${launchSessionId}:${score}:lezgamez-mvp`)',
        },
      },
      nextRequiredEvents: ['ready', 'game_start', 'game_over', 'score_submit'],
    };
  }

  @Post('scores')
  submitScore(@Body() body: { userId?: string; gameSlug?: string; launchSessionId?: string; score?: number; reason?: string; checksum?: string }) {
    const userId = body.userId ?? 'demo-user';
    const score = Number(body.score ?? Number.NaN);

    if (!body.gameSlug || !body.launchSessionId || !Number.isFinite(score) || score < 0) {
      throw new BadRequestException('gameSlug, launchSessionId and non-negative score are required.');
    }

    if (score > 1_000_000) {
      throw new BadRequestException('Score rejected by basic anti-cheat range.');
    }

    const session = launchSessions.find((launchSession) => launchSession.id === body.launchSessionId);
    if (!session || session.userId !== userId || session.gameSlug !== body.gameSlug) {
      throw new BadRequestException('Invalid launch session.');
    }

    if (session.status === 'completed') {
      throw new BadRequestException('Launch session was already completed.');
    }

    const expectedChecksum = buildScoreChecksum(session.id, score);
    if (body.checksum !== expectedChecksum) {
      throw new BadRequestException('Invalid score checksum.');
    }

    const game = getGame(body.gameSlug);
    if (!game) {
      throw new BadRequestException('Unknown game.');
    }

    session.status = 'completed';
    session.startedAt = session.startedAt ?? session.createdAt;
    session.completedAt = now();

    const coins = calculateReward(game, score);
    const scoreRecord: ScoreRecord = {
      id: makeId('score'),
      userId,
      gameSlug: game.slug,
      launchSessionId: session.id,
      score,
      reason: body.reason ?? 'game_over',
      coins,
      accepted: true,
      createdAt: now(),
    };

    scores.push(scoreRecord);

    if (coins > 0) {
      const cap = getRewardCap(game.slug, game.rewardRules.baseCoins);
      cap.earnedToday += coins;
      walletTransactions.push({
        id: makeId('wtx_reward'),
        userId,
        type: 'reward',
        amount: coins,
        reason: 'valid_score_reward',
        source: `scores/${game.slug}/${session.id}`,
        auditId: makeId('audit_wallet'),
        createdAt: now(),
      });
    }

    return {
      accepted: true,
      serverValidated: true,
      launchSessionId: session.id,
      score: scoreRecord,
      coinsEarned: coins,
      wallet: getWallet(userId),
    };
  }

  @Get('leaderboards/:gameSlug')
  leaderboard(@Param('gameSlug') gameSlug: string) {
    const ranked = scores
      .filter((score) => score.gameSlug === gameSlug && score.accepted)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((score, index) => ({ rank: index + 1, userId: score.userId, score: score.score, createdAt: score.createdAt }));

    return { gameSlug, ranked };
  }

  @Post('analytics/events')
  analytics(@Body() body: { name?: string; userId?: string; gameSlug?: string; launchSessionId?: string; payload?: Record<string, unknown> }) {
    if (!body.name) {
      throw new BadRequestException('Event name is required.');
    }

    const event: AnalyticsEvent = {
      id: makeId('event'),
      name: body.name,
      userId: body.userId ?? 'demo-user',
      gameSlug: body.gameSlug,
      launchSessionId: body.launchSessionId,
      payload: body.payload,
      createdAt: now(),
    };

    analyticsEvents.push(event);
    return { accepted: true, event };
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

    const alreadyOwned = inventoryItems.some((inventoryItem) => inventoryItem.userId === userId && inventoryItem.storeItemId === item.id);
    if (alreadyOwned) {
      throw new BadRequestException('Item already owned.');
    }

    const transaction: WalletTransaction = {
      id: makeId('wtx_purchase'),
      userId,
      type: 'purchase',
      amount: -item.price,
      reason: 'cosmetic_purchase',
      source: `store/${item.id}`,
      auditId: makeId('audit_wallet'),
      createdAt: now(),
    };

    const inventoryItem: InventoryItem = {
      id: makeId('inv'),
      userId,
      storeItemId: item.id,
      equippedFor: body.gameSlug ? [body.gameSlug] : [],
    };

    walletTransactions.push(transaction);
    inventoryItems.push(inventoryItem);

    return {
      approved: true,
      serverValidated: true,
      purchase: { userId, itemId: item.id, price: item.price, walletTransactionId: transaction.id, inventoryItemId: inventoryItem.id },
      wallet: getWallet(userId),
      inventory: getOwnedInventory(userId),
    };
  }
}

@Module({ controllers: [ApiController] })
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: true });
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT || 4000);
}

bootstrap();
