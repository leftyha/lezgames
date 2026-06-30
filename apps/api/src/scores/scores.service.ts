import { Injectable } from '@nestjs/common';
import { AntiCheatService } from '../anti-cheat/anti-cheat.service';
import { DEMO_USER_ID, startOfUtcDay } from '../common/domain.utils';
import { GameLaunchSessionsService } from '../game-launch-sessions/game-launch-sessions.service';
import { GamesService } from '../games/games.service';
import { LeaderboardsService } from '../leaderboards/leaderboards.service';
import { PrismaService } from '../prisma.service';
import { RewardsService } from '../rewards/rewards.service';
import { UsersService } from '../users/users.service';
import { WalletService } from '../wallet/wallet.service';
import { SubmitScoreDto } from './dto/submit-score.dto';

@Injectable()
export class ScoresService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly users: UsersService,
    private readonly games: GamesService,
    private readonly launchSessions: GameLaunchSessionsService,
    private readonly antiCheat: AntiCheatService,
    private readonly rewards: RewardsService,
    private readonly wallet: WalletService,
    private readonly leaderboards: LeaderboardsService,
  ) {}

  async submit(body: SubmitScoreDto) {
    const user = await this.users.getOrCreate(body.userId || DEMO_USER_ID);
    const score = Number(body.score);
    this.antiCheat.validateScoreRange(score);

    const session = await this.launchSessions.findById(body.launchSessionId);
    this.antiCheat.validateLaunchSession(session, user.id, body.gameSlug);
    this.antiCheat.validateChecksum(body.launchSessionId, score, body.checksum);

    const game = await this.games.findBySlug(body.gameSlug);
    const capDate = startOfUtcDay();
    const cap = await this.rewards.getOrCreateCap(user.id, game.slug, game.rewardBaseCoins, game.rewardDailyCap, capDate);
    const coins = this.rewards.calculateCoins(score, game.rewardBaseCoins, game.rewardDailyCap, cap.earnedToday);

    const scoreRecord = await this.prisma.score.create({ data: { userId: user.id, gameSlug: game.slug, launchSessionId: session!.id, score, reason: body.reason ?? 'game_over', coins, accepted: true } });
    await this.launchSessions.complete(session!.id, session!.startedAt ?? session!.createdAt);
    await this.rewards.applyRewardCap(user.id, game.slug, game.rewardBaseCoins, game.rewardDailyCap, coins);

    if (coins > 0) {
      await this.wallet.createRewardTransaction(user.id, game.slug, session!.id, coins);
      await this.rewards.createRewardLedger(user.id, game.slug, session!.id, scoreRecord.id, coins);
    }

    await this.leaderboards.upsertEntries(user.id, game.slug, score, scoreRecord.id);
    return { accepted: true, serverValidated: true, launchSessionId: session!.id, score: scoreRecord, coinsEarned: coins, wallet: await this.wallet.getWallet(user.id, user.username), bestScore: await this.bestForUser(user.username, game.slug) };
  }

  async bestForUser(publicUserId: string, gameSlug: string) {
    const user = await this.users.getOrCreate(publicUserId || DEMO_USER_ID);
    const best = await this.prisma.score.findFirst({ where: { userId: user.id, gameSlug, accepted: true }, orderBy: [{ score: 'desc' }, { createdAt: 'asc' }] });
    return { userId: user.username, gameSlug, bestScore: best?.score ?? 0, score: best };
  }
}
