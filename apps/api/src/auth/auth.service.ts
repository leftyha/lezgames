import { Injectable } from '@nestjs/common';
import { SessionStatus } from '@prisma/client';
import { makeToken } from '../common/domain.utils';
import { PrismaService } from '../prisma.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly users: UsersService) {}

  async createDemoSession(username = 'demo-user') {
    const user = await this.users.getOrCreate(username);
    const session = await this.prisma.session.create({
      data: { userId: user.id, sessionToken: makeToken('auth_session'), status: SessionStatus.active, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    });
    return { user: { id: user.id, username: user.username }, session };
  }
}
