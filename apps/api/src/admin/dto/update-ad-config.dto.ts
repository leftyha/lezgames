import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';

export class UpdateAdConfigDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  interstitialEveryDeaths?: number;

  @IsOptional()
  @IsBoolean()
  banner?: boolean;
}
