import { BadRequestException, Injectable } from '@nestjs/common';
import { GameLaunchSession } from '@prisma/client';
import { buildScoreChecksum } from '../common/domain.utils';

@Injectable()
export class AntiCheatService {
  validateScoreRange(score: number) {
    if (!Number.isFinite(score) || score < 0) throw new BadRequestException('gameSlug, launchSessionId and non-negative score are required.');
    if (score > 1_000_000) throw new BadRequestException('Score rejected by basic anti-cheat range.');
  }

  validateLaunchSession(session: GameLaunchSession | null, userId: string, gameSlug: string) {
    if (!session || session.userId !== userId || session.gameSlug !== gameSlug) throw new BadRequestException('Invalid launch session.');
    if (session.status === 'completed') throw new BadRequestException('Launch session was already completed.');
  }

  validateChecksum(launchSessionId: string, score: number, received?: string) {
    if (received !== buildScoreChecksum(launchSessionId, score)) throw new BadRequestException('Invalid score checksum.');
  }
}
