import { BadRequestException, Injectable } from '@nestjs/common';
import { AdEventType } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { UsersService } from '../users/users.service';
import { CreateAdEventDto } from './dto/create-ad-event.dto';

@Injectable()
export class AdsService {
  constructor(private readonly prisma: PrismaService, private readonly users: UsersService) {}

  async createEvent(body: CreateAdEventDto) {
    if (!Object.values(AdEventType).includes(body.type as AdEventType)) throw new BadRequestException('Invalid ad event type.');
    const user = body.userId ? await this.users.findByPublicId(body.userId) : null;
    const game = body.gameSlug ? await this.prisma.game.findUnique({ where: { slug: body.gameSlug } }) : null;
    const launchSession = body.launchSessionId ? await this.prisma.gameLaunchSession.findUnique({ where: { id: body.launchSessionId } }) : null;
    const event = await this.prisma.adEvent.create({ data: { type: body.type as AdEventType, userId: user?.id, gameSlug: game?.slug, launchSessionId: launchSession?.id, provider: body.provider, placement: body.placement, revenueMicros: body.revenueMicros, payload: body.payload } });
    return { accepted: true, event };
  }
}
