import {
  EntitySubscriberInterface,
  EventSubscriber,
  RemoveEvent,
} from 'typeorm';
import { Album } from '@entities/album.entity';
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '@nestjs/common';

@EventSubscriber()
export class AlbumSubscriber implements EntitySubscriberInterface<Album> {
  private readonly logger = new Logger('AlbumSubscriber');
  listenTo() {
    return Album;
  }

  //Delete the album folder when an album is removed
  async afterRemove(event: RemoveEvent<Album>) {
    const album = event.entityId;
    if (album) {
      const folderPath = path.join('storage', 'albums', album.toString());
      if (fs.existsSync(folderPath)) {
        fs.rm(folderPath, { recursive: true }, (err) => {});
        this.logger.log(`Album folder deleted: ${folderPath}`);
      }
    }
  }
}
