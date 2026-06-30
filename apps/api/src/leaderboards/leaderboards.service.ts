import { Injectable } from '@nestjs/common';
import { LeaderboardPeriod } from '@prisma/client';
import { periodWindow } from '../common/domain.utils';
import { PrismaService } from '../prisma.service';

@Injectable()
export class LeaderboardsService {
  constructor(private readonly prisma: PrismaService) {}

  async upsertEntries(userId: string, gameSlug: string, score: number, scoreId: string) {
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

  async getLeaderboard(gameSlug: string, period: LeaderboardPeriod) {
    const window = periodWindow(period);
    const entries = await this.prisma.leaderboardEntry.findMany({ where: { gameSlug, period, periodStart: window.periodStart }, orderBy: [{ score: 'desc' }, { updatedAt: 'asc' }], take: 10, include: { user: true } });
    return { gameSlug, period, periodStart: window.periodStart, periodEnd: window.periodEnd, ranked: entries.map((entry, index) => ({ rank: index + 1, userId: entry.user.username, score: entry.score, updatedAt: entry.updatedAt })) };
  }
}
