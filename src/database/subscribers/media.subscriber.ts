import {
  EntitySubscriberInterface,
  EventSubscriber,
  RemoveEvent,
} from 'typeorm';
import { Media } from '@entities/media.entity';
import * as path from 'path';
import * as fs from 'fs';
import { Logger } from '@nestjs/common';

@EventSubscriber()
export class MediaSubscriber implements EntitySubscriberInterface<Media> {
  private readonly logger = new Logger('MediaSubscriber');

  listenTo() {
    return Media;
  }

  async afterRemove(event: RemoveEvent<Media>) {
    const media = event.entity;
    if (media && media.path) {
      if (media.variations) {
        media.variations.forEach((variation) => {
          fs.unlinkSync(variation.path);
        });
      }

      const filePath = path.resolve(`${media.path}/${media.title}`);
      fs.unlink(filePath, (err) => {
        if (err) {
          this.logger.error(`Error deleting media file: ${err.message}`);
        } else {
          this.logger.log(`Media file deleted: ${filePath}`);
        }
      });
    }
  }
}
