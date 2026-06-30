import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class GamesService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    const games = await this.prisma.game.findMany({ orderBy: [{ status: 'asc' }, { title: 'asc' }] });
    return { games: games.map((game) => this.toDto(game)) };
  }

  async findPlayable(slug: string) {
    const game = await this.prisma.game.findUnique({ where: { slug } });
    if (!game || !game.isPlayable || game.status !== 'live') throw new BadRequestException('Game is not playable.');
    return game;
  }

  async findBySlug(slug: string) {
    const game = await this.prisma.game.findUnique({ where: { slug } });
    if (!game) throw new BadRequestException('Unknown game.');
    return game;
  }

  toDto(game: any) {
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
