import { LeaderboardPeriod } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';

export const DEMO_USER_ID = 'demo-user';
export const SCORE_CHECKSUM_SALT = process.env.SCORE_CHECKSUM_SALT ?? 'lezgamez-mvp';

export function makeToken(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
}

export function buildScoreChecksum(launchSessionId: string, score: number) {
  return Buffer.from(`${launchSessionId}:${score}:${SCORE_CHECKSUM_SALT}`).toString('base64url');
}

export function startOfUtcDay(date = new Date()) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function startOfUtcWeek(date = new Date()) {
  const start = startOfUtcDay(date);
  const day = start.getUTCDay();
  const daysSinceMonday = (day + 6) % 7;
  start.setUTCDate(start.getUTCDate() - daysSinceMonday);
  return start;
}

export function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

export function periodWindow(period: LeaderboardPeriod) {
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

export function parseLeaderboardPeriod(value?: string): LeaderboardPeriod {
  if (value === LeaderboardPeriod.daily) return LeaderboardPeriod.daily;
  if (value === LeaderboardPeriod.weekly) return LeaderboardPeriod.weekly;
  if (!value || value === LeaderboardPeriod.all_time) return LeaderboardPeriod.all_time;
  throw new BadRequestException('Invalid leaderboard period.');
}
