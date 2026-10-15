import { Injectable, BadRequestException } from '@nestjs/common';
import * as sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class MediaService {
  private uploadDir = path.join(process.cwd(), 'uploads');

  constructor() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async processAndSaveImage(file: Express.Multer.File) {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
      throw new BadRequestException('Unsupported file type');
    }

    const filename = uuidv4() + '.webp';
    const filePath = path.join(this.uploadDir, filename);
    const thumbFilename = 'thumb_' + filename;
    const thumbPath = path.join(this.uploadDir, thumbFilename);

    const image = sharp(file.buffer);
    const metadata = await image.metadata();

    await image
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(filePath);

    await sharp(file.buffer)
      .resize({ width: 300, height: 300, fit: 'cover' })
      .webp({ quality: 80 })
      .toFile(thumbPath);

    return {
      url: `/uploads/${filename}`,
      thumbnailUrl: `/uploads/${thumbFilename}`,
      width: metadata.width,
      height: metadata.height
    };
  }
}