import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class SubmitScoreDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsString()
  gameSlug!: string;

  @IsString()
  launchSessionId!: string;

  @IsNumber()
  @Min(0)
  score!: number;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsString()
  checksum!: string;
}
