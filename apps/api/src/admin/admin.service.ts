import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async dashboard() {
    const [users, games, sessions, scores, purchases, bugs, adEvents, analyticsEvents] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.game.count(),
      this.prisma.gameLaunchSession.count(),
      this.prisma.score.count(),
      this.prisma.purchase.count(),
      this.prisma.bugReport.count({ where: { status: 'open' } }),
      this.prisma.adEvent.count(),
      this.prisma.analyticsEvent.count(),
    ]);
    return { users, games, sessions, scores, purchases, openBugs: bugs, adEvents, analyticsEvents };
  }
}
