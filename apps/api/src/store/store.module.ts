import { Module } from '@nestjs/common';
import { InventoryModule } from '../inventory/inventory.module';
import { UsersModule } from '../users/users.module';
import { WalletModule } from '../wallet/wallet.module';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';

@Module({
  imports: [UsersModule, WalletModule, InventoryModule],
  controllers: [StoreController],
  providers: [StoreService],
  exports: [StoreService],
})
export class StoreModule {}
