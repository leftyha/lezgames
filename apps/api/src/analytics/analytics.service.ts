import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UsersService } from '../users/users.service';
import { CreateAnalyticsEventDto } from './dto/create-analytics-event.dto';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService, private readonly users: UsersService) {}

  async create(body: CreateAnalyticsEventDto) {
    const user = body.userId ? await this.users.findByPublicId(body.userId) : null;
    const game = body.gameSlug ? await this.prisma.game.findUnique({ where: { slug: body.gameSlug } }) : null;
    const launchSession = body.launchSessionId ? await this.prisma.gameLaunchSession.findUnique({ where: { id: body.launchSessionId } }) : null;
    const event = await this.prisma.analyticsEvent.create({ data: { name: body.name, userId: user?.id, gameSlug: game?.slug, launchSessionId: launchSession?.id, payload: body.payload } });
    return { accepted: true, event };
  }
}
