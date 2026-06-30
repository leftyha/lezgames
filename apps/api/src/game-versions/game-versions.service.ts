import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class GameVersionsService {
  constructor(private readonly prisma: PrismaService) {}

  list(gameSlug?: string) {
    return this.prisma.gameVersion.findMany({ where: gameSlug ? { gameSlug } : undefined, orderBy: [{ gameSlug: 'asc' }, { createdAt: 'desc' }] });
  }
}
