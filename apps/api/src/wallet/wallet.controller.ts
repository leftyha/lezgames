import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { WalletService } from './wallet.service';

@Controller('v1/wallet')
export class WalletController {
  constructor(private readonly users: UsersService, private readonly wallet: WalletService) {}

  @Get(':userId')
  async getWallet(@Param('userId') userId: string) {
    const user = await this.users.getOrCreate(userId);
    return this.wallet.getWallet(user.id, user.username);
  }

  @Get(':userId/transactions')
  async ledger(@Param('userId') userId: string) {
    const user = await this.users.getOrCreate(userId);
    const wallet = await this.wallet.getWallet(user.id, user.username);
    return { userId: user.username, transactions: wallet.transactions };
  }
}
