import { BadRequestException, Injectable } from '@nestjs/common';
import { LaunchSessionStatus } from '@prisma/client';
import { DEMO_USER_ID, makeToken } from '../common/domain.utils';
import { GamesService } from '../games/games.service';
import { InventoryService } from '../inventory/inventory.service';
import { PrismaService } from '../prisma.service';
import { UsersService } from '../users/users.service';
import { WalletService } from '../wallet/wallet.service';
import { CreateLaunchSessionDto } from './dto/create-launch-session.dto';

@Injectable()
export class GameLaunchSessionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly users: UsersService,
    private readonly games: GamesService,
    private readonly wallet: WalletService,
    private readonly inventory: InventoryService,
  ) {}

  async create(body: CreateLaunchSessionDto) {
    const user = await this.users.getOrCreate(body.userId || DEMO_USER_ID, body.language);
    if (body.adblockStatus === 'blocked') throw new BadRequestException('Adblock detected. LezGamez is free because ads keep the games online. Please disable your adblocker to play.');

    const game = await this.games.findPlayable(body.gameSlug);
    const session = await this.prisma.gameLaunchSession.create({
      data: {
        userId: user.id,
        gameSlug: game.slug,
        status: LaunchSessionStatus.created,
        sessionToken: makeToken('session_token'),
        deviceType: body.deviceType ?? 'unknown',
        language: body.language ?? user.language,
        adblockStatus: body.adblockStatus ?? 'clear',
      },
    });

    const wallet = await this.wallet.getWallet(user.id, user.username);
    return {
      launchSessionId: session.id,
      sessionToken: session.sessionToken,
      gameUrl: game.gameUrl,
      game: this.games.toDto(game),
      context: {
        userId: user.username,
        language: session.language,
        deviceType: session.deviceType,
        walletBalance: wallet.balance,
        inventory: await this.inventory.getOwnedInventory(user.id),
        equippedItems: {},
        adStatus: 'ready',
        adblockStatus: session.adblockStatus,
        sessionToken: session.sessionToken,
        launchSessionId: session.id,
        gameConfig: {},
      },
      nextRequiredEvents: ['ready', 'game_start', 'game_over', 'score_submit'],
    };
  }

  findById(id: string) {
    return this.prisma.gameLaunchSession.findUnique({ where: { id } });
  }

  complete(id: string, startedAt: Date) {
    return this.prisma.gameLaunchSession.update({ where: { id }, data: { status: LaunchSessionStatus.completed, startedAt, completedAt: new Date() } });
  }
}
