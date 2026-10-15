import { Controller, Post, UseInterceptors, UploadedFiles, UseGuards, BadRequestException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('media')
@Controller('media')
export class MediaController {
  constructor(private readonly service: MediaService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' }
        }
      }
    }
  })
  @UseInterceptors(FilesInterceptor('files', 12))
  async upload(@UploadedFiles() files: Array<Express.Multer.File>) {
    if (!files || files.length === 0) throw new BadRequestException('No files provided');
    const results = [];
    for (const file of files) {
      results.push(await this.service.processAndSaveImage(file));
    }
    return results;
  }
}