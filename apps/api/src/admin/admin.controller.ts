import { Controller, Get } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('v1/admin')
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get('dashboard')
  dashboard() {
    return this.admin.dashboard();
  }
}
