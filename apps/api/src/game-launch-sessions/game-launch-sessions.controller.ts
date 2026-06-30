import { Body, Controller, Post } from '@nestjs/common';
import { CreateLaunchSessionDto } from './dto/create-launch-session.dto';
import { GameLaunchSessionsService } from './game-launch-sessions.service';

@Controller('v1/launch-sessions')
export class GameLaunchSessionsController {
  constructor(private readonly launchSessions: GameLaunchSessionsService) {}

  @Post()
  create(@Body() body: CreateLaunchSessionDto) {
    return this.launchSessions.create(body);
  }
}
