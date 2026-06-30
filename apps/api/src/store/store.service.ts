import { BadRequestException, Injectable } from '@nestjs/common';
import { InventoryService } from '../inventory/inventory.service';
import { PrismaService } from '../prisma.service';
import { UsersService } from '../users/users.service';
import { WalletService } from '../wallet/wallet.service';
import { DEMO_USER_ID } from '../common/domain.utils';
import { PurchaseDto } from './dto/purchase.dto';

@Injectable()
export class StoreService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly users: UsersService,
    private readonly wallet: WalletService,
    private readonly inventory: InventoryService,
  ) {}

  async listItems() {
    const items = await this.prisma.storeItem.findMany({ where: { active: true }, orderBy: [{ featured: 'desc' }, { price: 'asc' }] });
    return { items, categories: ['skins', 'trails', 'hit_effects', 'profile_badges', 'frames', 'seasonal_items'] };
  }

  async purchase(body: PurchaseDto) {
    const user = await this.users.getOrCreate(body.userId || DEMO_USER_ID);
    const item = await this.prisma.storeItem.findUnique({ where: { id: body.itemId } });
    if (!item || !item.active) throw new BadRequestException('Unknown store item.');
    if (body.gameSlug && !item.compatibleGames.includes(body.gameSlug)) throw new BadRequestException('Item is not compatible with this game.');

    const wallet = await this.wallet.getWallet(user.id, user.username);
    if (wallet.balance < item.price) throw new BadRequestException('Insufficient Lez Coins balance.');

    const alreadyOwned = await this.inventory.findOwned(user.id, item.id);
    if (alreadyOwned) throw new BadRequestException('Item already owned.');

    const purchase = await this.prisma.purchase.create({ data: { userId: user.id, storeItemId: item.id, price: item.price, gameSlug: body.gameSlug } });
    const transaction = await this.wallet.createPurchaseTransaction(user.id, item.id, purchase.id, item.price);
    const inventoryItem = await this.inventory.createOwned(user.id, item.id, body.gameSlug ? [body.gameSlug] : []);

    return {
      approved: true,
      serverValidated: true,
      purchase: { userId: user.username, itemId: item.id, price: item.price, purchaseId: purchase.id, walletTransactionId: transaction.id, inventoryItemId: inventoryItem.id },
      wallet: await this.wallet.getWallet(user.id, user.username),
      inventory: await this.inventory.getOwnedInventory(user.id),
    };
  }
}
