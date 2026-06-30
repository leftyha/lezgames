import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UpdateAdConfigDto } from './dto/update-ad-config.dto';

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

  async getGameAdConfig(slug: string) {
    const game = await this.prisma.game.findUnique({ where: { slug }, select: { slug: true, title: true, adEveryDeaths: true, adBanner: true } });
    if (!game) throw new BadRequestException('Unknown game.');
    return { gameSlug: game.slug, title: game.title, adRules: { interstitialEveryDeaths: game.adEveryDeaths, banner: game.adBanner } };
  }

  async updateGameAdConfig(slug: string, dto: UpdateAdConfigDto) {
    const game = await this.prisma.game.findUnique({ where: { slug } });
    if (!game) throw new BadRequestException('Unknown game.');
    const updated = await this.prisma.game.update({
      where: { slug },
      data: {
        adEveryDeaths: dto.interstitialEveryDeaths ?? game.adEveryDeaths,
        adBanner: dto.banner ?? game.adBanner,
      },
      select: { slug: true, title: true, adEveryDeaths: true, adBanner: true },
    });
    return { gameSlug: updated.slug, title: updated.title, adRules: { interstitialEveryDeaths: updated.adEveryDeaths, banner: updated.adBanner } };
  }
}
