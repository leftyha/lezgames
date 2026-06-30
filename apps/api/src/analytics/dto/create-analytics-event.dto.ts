import { IsObject, IsOptional, IsString } from 'class-validator';

export class CreateAnalyticsEventDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  gameSlug?: string;

  @IsOptional()
  @IsString()
  launchSessionId?: string;

  @IsOptional()
  @IsObject()
  payload?: Record<string, unknown>;
}
