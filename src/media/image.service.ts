import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { extname, basename } from 'path';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class ImageService {
  private readonly IMAGE_QUALITY = 80;
  constructor(@InjectQueue('image') private imageQueue: Queue) {}

  async generateVariations(filePath: string, outputDir: string, variations: any[], mediaId: number) {
    variations.forEach(async (variation) => {
      await this.imageQueue.add('image', { filePath, outputDir, variation, mediaId });
    });
  }

  async resize(
    filePath: string,
    outputDir: string,
    config: any,
  ): Promise<any> {

    try {
      const { name, width, height, slug, format } = config;

      const fileExt = extname(filePath);
      const fileName = basename(filePath, fileExt);

      const outputFilePath = `${outputDir}/${fileName}${slug}.${format}`;

      const outputInfo = await sharp(filePath)
        .withMetadata()
        .resize(width, height)
        .webp({ quality: this.IMAGE_QUALITY })
        .toFile(outputFilePath);

      return { ...outputInfo, path: outputFilePath, type: name };
    } catch (error) {
      console.error('Error resizing image:', error);
      return false;
    }
  }

  async transform(
    filePath: string,
    outputDir: string,
    config: any,
  ): Promise<any> {
    const fileExt = extname(filePath);
    const fileName = basename(filePath, fileExt);
    const outputFilePath = `${outputDir}/${fileName}.${config.format}`;

    try {
      const variation = await sharp(filePath)
        .withMetadata()
        .toFormat(config.format, { quality: this.IMAGE_QUALITY })
        .toFile(outputFilePath);

      return { ...variation, path: outputFilePath, type: config.name };
    } catch (error) {
      console.error('Error transforming image:', error);
      return false;
    }
  }
}
