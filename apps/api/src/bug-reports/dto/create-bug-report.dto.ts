import { IsObject, IsOptional, IsString } from 'class-validator';

export class CreateBugReportDto {
  @IsString()
  message!: string;

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
  severity?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
