import { Module } from '@nestjs/common';
import { AIVerificationController } from './ai-verification.controller';
import { AIVerificationService } from './ai-verification.service';

@Module({
  controllers: [AIVerificationController],
  providers: [AIVerificationService],
  exports: [AIVerificationService],
})
export class AIVerificationModule {}

