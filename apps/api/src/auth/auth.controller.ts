import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('demo-session')
  createDemoSession() {
    return this.auth.createDemoSession();
  }
}
