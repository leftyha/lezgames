import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { InventoryService } from './inventory.service';

@Controller('v1/inventory')
export class InventoryController {
  constructor(private readonly users: UsersService, private readonly inventory: InventoryService) {}

  @Get(':userId')
  async getInventory(@Param('userId') userId: string) {
    const user = await this.users.getOrCreate(userId);
    return { userId: user.username, owned: await this.inventory.getOwnedInventory(user.id) };
  }
}
