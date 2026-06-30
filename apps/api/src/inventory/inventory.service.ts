import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  getOwnedInventory(userId: string) {
    return this.prisma.inventoryItem.findMany({ where: { userId }, include: { storeItem: true }, orderBy: { createdAt: 'desc' } });
  }

  findOwned(userId: string, storeItemId: string) {
    return this.prisma.inventoryItem.findUnique({ where: { userId_storeItemId: { userId, storeItemId } } });
  }

  createOwned(userId: string, storeItemId: string, equippedFor: string[] = []) {
    return this.prisma.inventoryItem.create({ data: { userId, storeItemId, equippedFor }, include: { storeItem: true } });
  }
}
