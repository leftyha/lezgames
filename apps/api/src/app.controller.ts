import { BadRequestException, Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AdEventType, LaunchSessionStatus, LeaderboardPeriod, WalletTransactionType } from '@prisma/client';
import { PrismaService } from './prisma.service';

const DEMO_USER_ID = 'demo-user';
const CHECKSUM_SALT = process.env.SCORE_CHECKSUM_SALT ?? 'lezgamez-mvp';

function makeToken(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
}

function checksum(launchSessionId: string, score: number) {
  return Buffer.from(`${launchSessionId}:${score}:${CHECKSUM_SALT}`).toString('base64url');
}

function startOfUtcDay(date = new Date()) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function startOfUtcWeek(date = new Date()) {
  const start = startOfUtcDay(date);
  const day = start.getUTCDay();
  const daysSinceMonday = (day + 6) % 7;
  start.setUTCDate(start.getUTCDate() - daysSinceMonday);
  return start;
}

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

function periodWindow(period: LeaderboardPeriod) {
  if (period === LeaderboardPeriod.daily) {
    const periodStart = startOfUtcDay();
    return { periodStart, periodEnd: addDays(periodStart, 1) };
  }

  if (period === LeaderboardPeriod.weekly) {
    const periodStart = startOfUtcWeek();
    return { periodStart, periodEnd: addDays(periodStart, 7) };
  }

  return { periodStart: new Date(0), periodEnd: null };
}

function parseLeaderboardPeriod(value?: string): LeaderboardPeriod {
  if (value === LeaderboardPeriod.daily) return LeaderboardPeriod.daily;
  if (value === LeaderboardPeriod.weekly) return LeaderboardPeriod.weekly;
  return LeaderboardPeriod.all_time;
}

function parseAdEventType(value?: string): AdEventType {
  if (value && Object.values(AdEventType).includes(value as AdEventType)) return value as AdEventType;
  throw new BadRequestException('Invalid ad event type.');
}

@Controller('v1')
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('health')
  health() {
    return { ok: true, service: 'lezgamez-api', persistence: 'postgresql-prisma' };
  }

  @Get('modules')
  modules() {
    return {
      rule: 'client never decides wallet, rewards, scores or transactions',
      runtimeState: 'persistent database, not in-memory arrays',
      implemented: ['games', 'game versions', 'sessions schema', 'admin users schema', 'launch sessions', 'scores', 'leaderboards by period', 'wallet ledger', 'reward ledger', 'store', 'inventory', 'purchases', 'quests schema', 'bug reports', 'ad events', 'analytics events'],
      pending: ['auth guards', 'admin backoffice UI', 'ads network integration', 'advanced anti-cheat', 'Redis rate limit'],
    };
  }

  @Get('games')
  async games() {
    const games = await this.prisma.game.findMany({ orderBy: [{ status: 'asc' }, { title: 'asc' }] });
    return { games: games.map((game) => this.toGameDto(game)) };
  }

  @Get('wallet/:userId')
  async wallet(@Param('userId') userId: string) {
    const user = await this.getOrCreateUser(userId);
    return this.getWallet(user.id, user.username);
  }

  @Get('wallet/:userId/transactions')
  async walletLedger(@Param('userId') userId: string) {
    const user = await this.getOrCreateUser(userId);
    const wallet = await this.getWallet(user.id, user.username);
    return { userId: user.username, transactions: wallet.transactions };
  }

  @Get('store/items')
  async store() {
    const items = await this.prisma.storeItem.findMany({ where: { active: true }, orderBy: [{ featured: 'desc' }, { price: 'asc' }] });
    return { items, categories: ['skins', 'trails', 'hit_effects', 'profile_badges', 'frames', 'seasonal_items'] };
  }

  @Get('inventory/:userId')
  async inventory(@Param('userId') userId: string) {
    const user = await this.getOrCreateUser(userId);
    return { userId: user.username, owned: await this.getOwnedInventory(user.id) };
  }

  @Get('rewards/caps')
  async rewards() {
    const user = await this.getOrCreateUser(DEMO_USER_ID);
    const caps = await this.prisma.rewardCap.findMany({ where: { userId: user.id }, orderBy: [{ capDate: 'desc' }, { gameSlug: 'asc' }] });
    return { caps, rule: 'rewards are capped per user, per game and per UTC day' };
  }

  @Get('quests')
  async quests() {
    const quests = await this.prisma.quest.findMany({ where: { status: 'active' }, orderBy: { endsAt: 'asc' } });
    return { quests };
  }

  @Post('launch-sessions')
  async createLaunchSession(@Body() body: { userId?: string; gameSlug?: string; deviceType?: string; language?: string; adblockStatus?: string }) {
    const user = await this.getOrCreateUser(body.userId || DEMO_USER_ID, body.language);
    const gameSlug = body.gameSlug?.trim();

    if (!gameSlug) throw new BadRequestException('gameSlug is required.');

    const game = await this.prisma.game.findUnique({ where: { slug: gameSlug } });
    if (!game || !game.isPlayable || game.status !== 'live') throw new BadRequestException('Game is not playable.');
    if (body.adblockStatus === 'blocked') throw new BadRequestException('Adblock detected. LezGamez is free because ads keep the games online. Please disable your adblocker to play.');

    const session = await this.prisma.gameLaunchSession.create({
      data: {
        userId: user.id,
        gameSlug: game.slug,
        status: LaunchSessionStatus.created,
        sessionToken: makeToken('session_token'),
        deviceType: body.deviceType ?? 'unknown',
        language: body.language ?? user.language,
        adblockStatus: body.adblockStatus ?? 'clear',
      },
    });

    const wallet = await this.getWallet(user.id, user.username);

    return {
      launchSessionId: session.id,
      sessionToken: session.sessionToken,
      gameUrl: game.gameUrl,
      game: this.toGameDto(game),
      context: {
        userId: user.username,
        language: session.language,
        deviceType: session.deviceType,
        walletBalance: wallet.balance,
        inventory: await this.getOwnedInventory(user.id),
        equippedItems: {},
        adStatus: 'ready',
        adblockStatus: session.adblockStatus,
        sessionToken: session.sessionToken,
        launchSessionId: session.id,
        gameConfig: {},
      },
      nextRequiredEvents: ['ready', 'game_start', 'game_over', 'score_submit'],
    };
  }

  @Post('scores')
  async submitScore(@Body() body: { userId?: string; gameSlug?: string; launchSessionId?: string; score?: number; reason?: string; checksum?: string }) {
    const user = await this.getOrCreateUser(body.userId || DEMO_USER_ID);
    const score = Number(body.score ?? Number.NaN);

    if (!body.gameSlug || !body.launchSessionId || !Number.isFinite(score) || score < 0) throw new BadRequestException('gameSlug, launchSessionId and non-negative score are required.');
    if (score > 1_000_000) throw new BadRequestException('Score rejected by basic anti-cheat range.');

    const session = await this.prisma.gameLaunchSession.findUnique({ where: { id: body.launchSessionId } });
    if (!session || session.userId !== user.id || session.gameSlug !== body.gameSlug) throw new BadRequestException('Invalid launch session.');
    if (session.status === LaunchSessionStatus.completed) throw new BadRequestException('Launch session was already completed.');
    if (body.checksum !== checksum(session.id, score)) throw new BadRequestException('Invalid score checksum.');

    const game = await this.prisma.game.findUnique({ where: { slug: body.gameSlug } });
    if (!game) throw new BadRequestException('Unknown game.');

    const today = startOfUtcDay();
    const cap = await this.getOrCreateRewardCap(user.id, game.slug, game.rewardBaseCoins, game.rewardDailyCap, today);
    const coins = Math.min(game.rewardBaseCoins + Math.floor(score / 5000), Math.max(0, game.rewardDailyCap - cap.earnedToday));

    const scoreRecord = await this.prisma.score.create({
      data: { userId: user.id, gameSlug: game.slug, launchSessionId: session.id, score, reason: body.reason ?? 'game_over', coins, accepted: true },
    });

    await this.prisma.gameLaunchSession.update({ where: { id: session.id }, data: { status: LaunchSessionStatus.completed, startedAt: session.startedAt ?? session.createdAt, completedAt: new Date() } });
    await this.prisma.rewardCap.update({ where: { userId_gameSlug_capDate: { userId: user.id, gameSlug: game.slug, capDate: today } }, data: { earnedToday: cap.earnedToday + coins, baseCoins: game.rewardBaseCoins, dailyCap: game.rewardDailyCap } });

    if (coins > 0) {
      await this.prisma.walletTransaction.create({ data: { userId: user.id, type: WalletTransactionType.reward, amount: coins, reason: 'valid_score_reward', source: `scores/${game.slug}/${session.id}`, auditId: makeToken('audit_wallet') } });
      await this.prisma.rewardLedger.create({ data: { userId: user.id, gameSlug: game.slug, launchSessionId: session.id, scoreId: scoreRecord.id, coins, reason: 'valid_score_reward' } });
    }

    await this.upsertLeaderboardEntries(user.id, game.slug, score, scoreRecord.id);

    return { accepted: true, serverValidated: true, launchSessionId: session.id, score: scoreRecord, coinsEarned: coins, wallet: await this.getWallet(user.id, user.username) };
  }

  @Get('leaderboards/:gameSlug')
  async leaderboard(@Param('gameSlug') gameSlug: string) {
    return this.getLeaderboard(gameSlug, LeaderboardPeriod.all_time);
  }

  @Get('leaderboards/:gameSlug/:period')
  async leaderboardByPeriod(@Param('gameSlug') gameSlug: string, @Param('period') period: string) {
    return this.getLeaderboard(gameSlug, parseLeaderboardPeriod(period));
  }

  @Post('analytics/events')
  async analytics(@Body() body: { name?: string; userId?: string; gameSlug?: string; launchSessionId?: string; payload?: Record<string, unknown> }) {
    if (!body.name) throw new BadRequestException('Event name is required.');
    const user = body.userId ? await this.findUser(body.userId) : null;
    const game = body.gameSlug ? await this.prisma.game.findUnique({ where: { slug: body.gameSlug } }) : null;
    const launchSession = body.launchSessionId ? await this.prisma.gameLaunchSession.findUnique({ where: { id: body.launchSessionId } }) : null;
    const event = await this.prisma.analyticsEvent.create({ data: { name: body.name, userId: user?.id, gameSlug: game?.slug, launchSessionId: launchSession?.id, payload: body.payload ?? undefined } });
    return { accepted: true, event };
  }

  @Post('ads/events')
  async adEvent(@Body() body: { type?: string; userId?: string; gameSlug?: string; launchSessionId?: string; provider?: string; placement?: string; revenueMicros?: number; payload?: Record<string, unknown> }) {
    const type = parseAdEventType(body.type);
    const user = body.userId ? await this.findUser(body.userId) : null;
    const game = body.gameSlug ? await this.prisma.game.findUnique({ where: { slug: body.gameSlug } }) : null;
    const launchSession = body.launchSessionId ? await this.prisma.gameLaunchSession.findUnique({ where: { id: body.launchSessionId } }) : null;
    const event = await this.prisma.adEvent.create({ data: { type, userId: user?.id, gameSlug: game?.slug, launchSessionId: launchSession?.id, provider: body.provider, placement: body.placement, revenueMicros: body.revenueMicros, payload: body.payload ?? undefined } });
    return { accepted: true, event };
  }

  @Post('bug-reports')
  async bugReport(@Body() body: { message?: string; userId?: string; gameSlug?: string; launchSessionId?: string; severity?: string; metadata?: Record<string, unknown> }) {
    if (!body.message) throw new BadRequestException('message is required.');
    const user = body.userId ? await this.findUser(body.userId) : null;
    const game = body.gameSlug ? await this.prisma.game.findUnique({ where: { slug: body.gameSlug } }) : null;
    const launchSession = body.launchSessionId ? await this.prisma.gameLaunchSession.findUnique({ where: { id: body.launchSessionId } }) : null;
    const report = await this.prisma.bugReport.create({ data: { message: body.message, userId: user?.id, gameSlug: game?.slug, launchSessionId: launchSession?.id, severity: body.severity ?? 'normal', metadata: body.metadata ?? undefined } });
    return { accepted: true, report };
  }

  @Post('store/purchase')
  async purchase(@Body() body: { userId?: string; itemId?: string; gameSlug?: string }) {
    const user = await this.getOrCreateUser(body.userId || DEMO_USER_ID);
    const item = body.itemId ? await this.prisma.storeItem.findUnique({ where: { id: body.itemId } }) : null;

    if (!item || !item.active) throw new BadRequestException('Unknown store item.');
    if (body.gameSlug && !item.compatibleGames.includes(body.gameSlug)) throw new BadRequestException('Item is not compatible with this game.');

    const wallet = await this.getWallet(user.id, user.username);
    if (wallet.balance < item.price) throw new BadRequestException('Insufficient Lez Coins balance.');

    const alreadyOwned = await this.prisma.inventoryItem.findUnique({ where: { userId_storeItemId: { userId: user.id, storeItemId: item.id } } });
    if (alreadyOwned) throw new BadRequestException('Item already owned.');

    const purchase = await this.prisma.purchase.create({ data: { userId: user.id, storeItemId: item.id, price: item.price, gameSlug: body.gameSlug } });
    const transaction = await this.prisma.walletTransaction.create({ data: { userId: user.id, type: WalletTransactionType.purchase, amount: -item.price, reason: 'cosmetic_purchase', source: `store/${item.id}/${purchase.id}`, auditId: makeToken('audit_wallet') } });
    const inventoryItem = await this.prisma.inventoryItem.create({ data: { userId: user.id, storeItemId: item.id, equippedFor: body.gameSlug ? [body.gameSlug] : [] }, include: { storeItem: true } });

    return { approved: true, serverValidated: true, purchase: { userId: user.username, itemId: item.id, price: item.price, purchaseId: purchase.id, walletTransactionId: transaction.id, inventoryItemId: inventoryItem.id }, wallet: await this.getWallet(user.id, user.username), inventory: await this.getOwnedInventory(user.id) };
  }

  private async findUser(publicUserId: string) {
    return this.prisma.user.findFirst({ where: { OR: [{ id: publicUserId }, { username: publicUserId }] } });
  }

  private async getOrCreateUser(publicUserId: string, language = 'en') {
    const existingUser = await this.findUser(publicUserId);
    if (existingUser) return existingUser;
    const user = await this.prisma.user.create({ data: { username: publicUserId, language } });
    await this.prisma.wallet.create({ data: { userId: user.id, currency: 'LC' } });
    return user;
  }

  private async getWallet(userId: string, username: string) {
    await this.prisma.wallet.upsert({ where: { userId }, update: { currency: 'LC' }, create: { userId, currency: 'LC' } });
    const transactions = await this.prisma.walletTransaction.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
    const balance = transactions.reduce((total, transaction) => total + transaction.amount, 0);
    return { userId: username, balance, currency: 'LC', disclaimer: 'Lez Coins are internal credits only and cannot be withdrawn, sold, transferred or exchanged for real money.', calculatedServerSide: true, persistence: 'postgresql-prisma', transactions };
  }

  private async getOwnedInventory(userId: string) {
    return this.prisma.inventoryItem.findMany({ where: { userId }, include: { storeItem: true }, orderBy: { createdAt: 'desc' } });
  }

  private async getOrCreateRewardCap(userId: string, gameSlug: string, baseCoins: number, dailyCap: number, capDate = startOfUtcDay()) {
    return this.prisma.rewardCap.upsert({ where: { userId_gameSlug_capDate: { userId, gameSlug, capDate } }, update: { baseCoins, dailyCap }, create: { userId, gameSlug, capDate, baseCoins, dailyCap, earnedToday: 0 } });
  }

  private async upsertLeaderboardEntries(userId: string, gameSlug: string, score: number, scoreId: string) {
    for (const period of [LeaderboardPeriod.daily, LeaderboardPeriod.weekly, LeaderboardPeriod.all_time]) {
      const window = periodWindow(period);
      const current = await this.prisma.leaderboardEntry.findUnique({ where: { userId_gameSlug_period_periodStart: { userId, gameSlug, period, periodStart: window.periodStart } } });
      if (!current || score > current.score) {
        await this.prisma.leaderboardEntry.upsert({
          where: { userId_gameSlug_period_periodStart: { userId, gameSlug, period, periodStart: window.periodStart } },
          update: { score, scoreId, periodEnd: window.periodEnd },
          create: { userId, gameSlug, period, periodStart: window.periodStart, periodEnd: window.periodEnd, score, scoreId },
        });
      }
    }
  }

  private async getLeaderboard(gameSlug: string, period: LeaderboardPeriod) {
    const window = periodWindow(period);
    const entries = await this.prisma.leaderboardEntry.findMany({ where: { gameSlug, period, periodStart: window.periodStart }, orderBy: [{ score: 'desc' }, { updatedAt: 'asc' }], take: 10, include: { user: true } });
    return { gameSlug, period, periodStart: window.periodStart, periodEnd: window.periodEnd, ranked: entries.map((entry, index) => ({ rank: index + 1, userId: entry.user.username, score: entry.score, updatedAt: entry.updatedAt })) };
  }

  private toGameDto(game: any) {
    return {
      slug: game.slug,
      title: game.title,
      status: game.status,
      shortDescription: game.shortDescription,
      fullDescription: game.fullDescription,
      category: game.category,
      tags: game.tags,
      thumbnail: game.thumbnail,
      ogImage: game.ogImage,
      isPlayable: game.isPlayable,
      gameUrl: game.gameUrl,
      gameType: game.gameType,
      supportedDevices: game.supportedDevices,
      controls: game.controls,
      rewardRules: { baseCoins: game.rewardBaseCoins, dailyCap: game.rewardDailyCap },
      adRules: { interstitialEveryDeaths: game.adEveryDeaths, banner: game.adBanner },
      storeCompatibility: game.storeCompatibility,
      releaseDate: game.releaseDate,
      seoTitle: game.seoTitle,
      seoDescription: game.seoDescription,
      faq: game.faq,
      relatedGames: game.relatedGames,
    };
  }
}
