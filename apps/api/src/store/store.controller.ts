import { Body, Controller, Get, Post } from '@nestjs/common';
import { PurchaseDto } from './dto/purchase.dto';
import { StoreService } from './store.service';

@Controller('v1/store')
export class StoreController {
  constructor(private readonly store: StoreService) {}

  @Get('items')
  listItems() {
    return this.store.listItems();
  }

  @Post('purchase')
  purchase(@Body() body: PurchaseDto) {
    return this.store.purchase(body);
  }
}
