import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UsersService } from '../users/users.service';
import { CreateBugReportDto } from './dto/create-bug-report.dto';

@Injectable()
export class BugReportsService {
  constructor(private readonly prisma: PrismaService, private readonly users: UsersService) {}

  async create(body: CreateBugReportDto) {
    const user = body.userId ? await this.users.findByPublicId(body.userId) : null;
    const game = body.gameSlug ? await this.prisma.game.findUnique({ where: { slug: body.gameSlug } }) : null;
    const launchSession = body.launchSessionId ? await this.prisma.gameLaunchSession.findUnique({ where: { id: body.launchSessionId } }) : null;
    const report = await this.prisma.bugReport.create({ data: { message: body.message, userId: user?.id, gameSlug: game?.slug, launchSessionId: launchSession?.id, severity: body.severity ?? 'normal', metadata: body.metadata } });
    return { accepted: true, report };
  }
}
