import { forwardRef, Module } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { StoriesController } from './stories.controller';
import { Story } from '@entities/story.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from './posts/posts.module';
import { MediaModule } from '@media/media.module';
import { Media } from '@entities/media.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Story, Media]),
    forwardRef(() => PostsModule),
    MediaModule,
  ],
  controllers: [StoriesController],
  providers: [StoriesService],
  exports: [StoriesService],
})
export class StoriesModule {}
