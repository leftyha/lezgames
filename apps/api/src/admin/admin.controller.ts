import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { AdminRole } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AdminService } from './admin.service';
import { UpdateAdConfigDto } from './dto/update-ad-config.dto';

@Controller('v1/admin')
@UseGuards(AuthGuard, RolesGuard)
@Roles(AdminRole.admin)
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get('dashboard')
  dashboard() {
    return this.admin.dashboard();
  }

  @Get('games/:slug/ad-config')
  getGameAdConfig(@Param('slug') slug: string) {
    return this.admin.getGameAdConfig(slug);
  }

  @Put('games/:slug/ad-config')
  updateGameAdConfig(@Param('slug') slug: string, @Body() body: UpdateAdConfigDto) {
    return this.admin.updateGameAdConfig(slug, body);
  }
}
