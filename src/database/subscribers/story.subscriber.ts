import {
  EntitySubscriberInterface,
  EventSubscriber,
  RemoveEvent,
} from 'typeorm';
import { Media } from '@entities/media.entity';
import * as path from 'path';
import * as fs from 'fs';
import { Logger } from '@nestjs/common';
import { Story } from '@entities/story.entity';

@EventSubscriber()
export class StorySubscriber implements EntitySubscriberInterface<Story> {
  private readonly logger = new Logger('MediaSubscriber');

  listenTo() {
    return Media;
  }

  async afterRemove(event: RemoveEvent<Story>) {
    const media = event.entity;
  }
}
