import { IsOptional, IsString } from 'class-validator';

export class PurchaseDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsString()
  itemId!: string;

  @IsOptional()
  @IsString()
  gameSlug?: string;
}
