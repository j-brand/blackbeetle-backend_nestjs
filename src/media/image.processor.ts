import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

import { ImageService } from './image.service';
import { variations as variationConfigs } from './image-variations.conf';
import { MediaService } from './media.service';
import { MediaVariation } from '@entities/media_variation.entity';
import { Brackets } from 'typeorm';

@Processor('image')
export class ImageProcessor extends WorkerHost {
  private readonly logger = new Logger(ImageProcessor.name);

  constructor(
    private readonly imageService: ImageService,
    private readonly mediaService: MediaService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log('Processing image');

    const { filePath, outputDir, variation, mediaId } = job.data;

    const variationConfig = await variationConfigs.find(
      (el) => el.name === variation,
    );

    let vari;

    switch (variationConfig.method) {
      case 'resize':
        this.logger.log('Resizing image');
        vari = await this.imageService.resize(
          filePath,
          outputDir,
          variationConfig,
        );
        break;
      case 'transform':
        this.logger.log('Transforming image');
        vari = await this.imageService.transform(
          filePath,
          outputDir,
          variationConfig,
        );
        break;
      default:
        this.logger.error('No method found for variation');
    }

    const newVariation = new MediaVariation();
    newVariation.path = vari.path;
    newVariation.type = vari.type;
    newVariation.width = vari.width;
    newVariation.height = vari.height;
    newVariation.media = await this.mediaService.findOne(mediaId);
    await this.mediaService.createVariation(newVariation);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`Processing of job ${job.id} completed`);
  }
}
