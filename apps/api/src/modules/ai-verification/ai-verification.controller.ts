import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AIVerificationService } from './ai-verification.service';
import { VerifyCameraDto } from './ai-verification.dto';
import { CameraVerificationResponse } from '@sell/shared-types';

@ApiTags('ai-verification')
@Controller()
export class AIVerificationController {
  constructor(private readonly verificationService: AIVerificationService) {}

  @Post('verify-camera')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify physical product via camera snapshot and screen-spoof detection' })
  @ApiResponse({ status: 200, description: 'AI verification inspection result' })
  async verifyCamera(@Body() dto: VerifyCameraDto): Promise<CameraVerificationResponse> {
    return this.verificationService.verifyProductImage(dto);
  }

  @Post('ai-verification/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify physical product (alias)' })
  @ApiResponse({ status: 200, description: 'AI verification inspection result' })
  async verifyProduct(@Body() dto: VerifyCameraDto): Promise<CameraVerificationResponse> {
    return this.verificationService.verifyProductImage(dto);
  }
}

