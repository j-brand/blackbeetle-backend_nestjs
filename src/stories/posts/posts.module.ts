import { forwardRef, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '@entities/post.entity';
import { MediaModule } from '@media/media.module';
import { Media } from '@entities/media.entity';
import { PostMedia } from '@entities/post_media.entity';
import { StoriesModule } from '@stories/stories.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostMedia, Media]), MediaModule, forwardRef(() =>StoriesModule)],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
