import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class SendOtpDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  identifier: string; // phone or email

  @IsString()
  @IsNotEmpty()
  otp: string;
}

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}