import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { startOfUtcDay } from '../common/domain.utils';

@Injectable()
export class RewardsService {
  constructor(private readonly prisma: PrismaService) {}

  async listCaps(userId: string) {
    const caps = await this.prisma.rewardCap.findMany({ where: { userId }, orderBy: [{ capDate: 'desc' }, { gameSlug: 'asc' }] });
    return { caps, rule: 'rewards are capped per user, per game and per UTC day' };
  }

  async getOrCreateCap(userId: string, gameSlug: string, baseCoins: number, dailyCap: number, capDate = startOfUtcDay()) {
    return this.prisma.rewardCap.upsert({
      where: { userId_gameSlug_capDate: { userId, gameSlug, capDate } },
      update: { baseCoins, dailyCap },
      create: { userId, gameSlug, capDate, baseCoins, dailyCap, earnedToday: 0 },
    });
  }

  calculateCoins(score: number, baseCoins: number, dailyCap: number, earnedToday: number) {
    return Math.min(baseCoins + Math.floor(score / 5000), Math.max(0, dailyCap - earnedToday));
  }

  async applyRewardCap(userId: string, gameSlug: string, baseCoins: number, dailyCap: number, coins: number) {
    const capDate = startOfUtcDay();
    const cap = await this.getOrCreateCap(userId, gameSlug, baseCoins, dailyCap, capDate);
    await this.prisma.rewardCap.update({
      where: { userId_gameSlug_capDate: { userId, gameSlug, capDate } },
      data: { earnedToday: cap.earnedToday + coins, baseCoins, dailyCap },
    });
    return cap;
  }

  createRewardLedger(userId: string, gameSlug: string, launchSessionId: string, scoreId: string, coins: number) {
    return this.prisma.rewardLedger.create({ data: { userId, gameSlug, launchSessionId, scoreId, coins, reason: 'valid_score_reward' } });
  }
}
