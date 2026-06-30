import { Controller, Get, Param } from '@nestjs/common';
import { LeaderboardPeriod } from '@prisma/client';
import { parseLeaderboardPeriod } from '../common/domain.utils';
import { LeaderboardsService } from './leaderboards.service';

@Controller('v1/leaderboards')
export class LeaderboardsController {
  constructor(private readonly leaderboards: LeaderboardsService) {}

  @Get(':gameSlug')
  allTime(@Param('gameSlug') gameSlug: string) {
    return this.leaderboards.getLeaderboard(gameSlug, LeaderboardPeriod.all_time);
  }

  @Get(':gameSlug/:period')
  byPeriod(@Param('gameSlug') gameSlug: string, @Param('period') period: string) {
    return this.leaderboards.getLeaderboard(gameSlug, parseLeaderboardPeriod(period));
  }
}
