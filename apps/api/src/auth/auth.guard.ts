import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { SessionStatus } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractBearerToken(request.headers.authorization);

    if (!token) throw new UnauthorizedException('Missing bearer token.');

    const session = await this.prisma.session.findUnique({ where: { sessionToken: token }, include: { user: { include: { adminUser: true } } } });
    if (!session || session.status !== SessionStatus.active || session.expiresAt <= new Date()) {
      throw new UnauthorizedException('Invalid or expired session.');
    }

    request.user = { id: session.user.id, username: session.user.username, role: session.user.adminUser?.active ? session.user.adminUser.role : undefined };
    return true;
  }

  private extractBearerToken(header?: string) {
    if (!header) return null;
    const [scheme, token] = header.split(' ');
    return scheme?.toLowerCase() === 'bearer' && token ? token : null;
  }
}
