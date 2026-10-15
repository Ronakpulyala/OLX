import { IsString, IsNumber, IsOptional, IsBoolean, IsObject } from 'class-validator';

export class CreateListingDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsString()
  condition: string;

  @IsString()
  categoryId: string;

  @IsBoolean()
  @IsOptional()
  isNegotiable?: boolean;

  @IsNumber()
  @IsOptional()
  lat?: number;

  @IsNumber()
  @IsOptional()
  lng?: number;

  @IsString()
  @IsOptional()
  locationAddress?: string;

  @IsObject()
  @IsOptional()
  attributes?: Record<string, any>;

  @IsBoolean()
  @IsOptional()
  isAIVerified?: boolean;

  @IsNumber()
  @IsOptional()
  aiConfidence?: number;

  @IsString()
  @IsOptional()
  verificationAuditId?: string;

  @IsObject()
  @IsOptional()
  aiDetectionData?: Record<string, any>;

  @IsString()
  @IsOptional()
  verifiedAt?: string;
}