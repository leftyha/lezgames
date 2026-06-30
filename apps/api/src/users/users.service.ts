import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByPublicId(publicUserId: string) {
    return this.prisma.user.findFirst({ where: { OR: [{ id: publicUserId }, { username: publicUserId }] } });
  }

  async getOrCreate(publicUserId: string, language = 'en') {
    const existingUser = await this.findByPublicId(publicUserId);
    if (existingUser) return existingUser;

    const user = await this.prisma.user.create({ data: { username: publicUserId, language } });
    await this.prisma.wallet.create({ data: { userId: user.id, currency: 'LC' } });
    return user;
  }
}
