import { Body, Controller, Post } from '@nestjs/common';
import { SubmitScoreDto } from './dto/submit-score.dto';
import { ScoresService } from './scores.service';

@Controller('v1/scores')
export class ScoresController {
  constructor(private readonly scores: ScoresService) {}

  @Post()
  submit(@Body() body: SubmitScoreDto) {
    return this.scores.submit(body);
  }
}
