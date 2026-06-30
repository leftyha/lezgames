import { Controller, Get } from '@nestjs/common';
import { DEMO_USER_ID } from '../common/domain.utils';
import { UsersService } from '../users/users.service';
import { RewardsService } from './rewards.service';

@Controller('v1/rewards')
export class RewardsController {
  constructor(private readonly users: UsersService, private readonly rewards: RewardsService) {}

  @Get('caps')
  async caps() {
    const user = await this.users.getOrCreate(DEMO_USER_ID);
    return this.rewards.listCaps(user.id);
  }
}
