import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class QuestsService {
  constructor(private readonly prisma: PrismaService) {}

  async listActive() {
    const quests = await this.prisma.quest.findMany({ where: { status: 'active' }, orderBy: { endsAt: 'asc' } });
    return { quests };
  }
}
