import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { CameraVerificationRequest } from '@sell/shared-types';

export class VerifyCameraDto implements CameraVerificationRequest {
  @IsString()
  @IsNotEmpty()
  imageBase64: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsOptional()
  description: string = '';

  @IsString()
  @IsOptional()
  condition?: string;

  @IsOptional()
  price?: string | number;

  @IsString()
  @IsOptional()
  testScenario?: 'screen_spoof' | 'mismatch_item' | 'legit_match' | 'live_webcam';

  @IsString()
  @IsOptional()
  simulatedObject?: string;
}

