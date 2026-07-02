import { Injectable } from '@nestjs/common';
import { WalletTransactionType } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { makeToken } from '../common/domain.utils';

@Injectable()
export class WalletService {
  constructor(private readonly prisma: PrismaService) {}

  async getWallet(userId: string, username: string) {
    await this.prisma.wallet.upsert({ where: { userId }, update: { currency: 'BC' }, create: { userId, currency: 'BC' } });
    const transactions = await this.prisma.walletTransaction.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
    const balance = transactions.reduce((total, transaction) => total + transaction.amount, 0);
    return {
      userId: username,
      balance,
      currency: 'BC',
      disclaimer: 'Bug Coins are internal credits only and cannot be withdrawn, sold, transferred or exchanged for real money.',
      calculatedServerSide: true,
      persistence: 'postgresql-prisma',
      transactions,
    };
  }

  createRewardTransaction(userId: string, gameSlug: string, launchSessionId: string, amount: number) {
    return this.prisma.walletTransaction.create({
      data: { userId, type: WalletTransactionType.reward, amount, reason: 'valid_score_reward', source: `scores/${gameSlug}/${launchSessionId}`, auditId: makeToken('audit_wallet') },
    });
  }

  createPurchaseTransaction(userId: string, itemId: string, purchaseId: string, amount: number) {
    return this.prisma.walletTransaction.create({
      data: { userId, type: WalletTransactionType.purchase, amount: -amount, reason: 'cosmetic_purchase', source: `store/${itemId}/${purchaseId}`, auditId: makeToken('audit_wallet') },
    });
  }
}
