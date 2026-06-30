import { IsIn, IsOptional, IsString } from 'class-validator';

export class CreateLaunchSessionDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsString()
  gameSlug!: string;

  @IsOptional()
  @IsString()
  deviceType?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsIn(['unknown', 'clear', 'blocked'])
  adblockStatus?: string;
}
