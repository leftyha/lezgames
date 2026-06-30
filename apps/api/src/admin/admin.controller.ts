import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminRole } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AdminService } from './admin.service';

@Controller('v1/admin')
@UseGuards(AuthGuard, RolesGuard)
@Roles(AdminRole.admin)
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get('dashboard')
  dashboard() {
    return this.admin.dashboard();
  }
}
