import { IsIn, IsInt, IsObject, IsOptional, IsString, Min } from 'class-validator';

export class CreateAdEventDto {
  @IsIn(['opportunity', 'requested', 'started', 'completed', 'skipped', 'failed', 'blocked'])
  type!: string;

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
  @IsString()
  provider?: string;

  @IsOptional()
  @IsString()
  placement?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  revenueMicros?: number;

  @IsOptional()
  @IsObject()
  payload?: Record<string, unknown>;
}
