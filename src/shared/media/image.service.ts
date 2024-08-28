import { Media } from '@entities/media.entity';
import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { extname, basename } from 'path';
import { variations as variationConfigs } from './image-variations.conf';
import { MediaVariation } from '@entities/media_variation.entity';

@Injectable()
export class ImageService {
  private readonly IMAGE_QUALITY = 80;

  async generateImageVariations(
    filePath: string,
    outputDir: string,
    variations: any[],
  ): Promise<MediaVariation[]> {
    const mediaItems = [];

    await Promise.all(
      variations.map(async (variation) => {
        const config = variationConfigs.find((el) => el.name === variation);

        if (!config) {
          console.warn('no config found for variation:', variation);
          return;
        }
        try {
          let processedVariation = await this.processVariation(
            filePath,
            outputDir,
            config,
          );

          if (processedVariation) {
            mediaItems.push({
              type:  processedVariation.type,
              height: processedVariation.height,
              width: processedVariation.width,
              path: processedVariation.path,
            });
          }
        } catch (error) {
          console.error('Error processing variation', error);
        }
      }),
    );

    return mediaItems;
  }

  private async processVariation(
    filePath: string,
    outputDir: string,
    variation: any,
  ): Promise<any> {
    const variationConfig = variation;
    if (!variationConfig) {
      return false;
    }
    switch (variationConfig.method) {
      case 'resize':
        return await this.resizeImage(filePath, outputDir, variationConfig);
      case 'transform':
        return await this.transformImage(filePath, outputDir, variationConfig);
      default:
        return false;
    }
  }

  async resizeImage(
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

  async transformImage(
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
