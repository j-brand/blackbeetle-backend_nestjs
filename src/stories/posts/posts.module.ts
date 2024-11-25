import { forwardRef, Module, ValidationPipe } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '@entities/post.entity';
import { MediaModule } from '@media/media.module';
import { Media } from '@entities/media.entity';
import { PostMedia } from '@entities/post_media.entity';
import { StoriesModule } from '@stories/stories.module';
import { UsersModule } from '@users/users.module';
import { APP_PIPE } from '@nestjs/core';
import { PublicPostsController } from './public-posts.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, PostMedia, Media]),
    MediaModule,
    forwardRef(() => StoriesModule),
    UsersModule,
  ],
  controllers: [PostsController, PublicPostsController],
  providers: [
    PostsService,
  ],
  exports: [PostsService],
})
export class PostsModule {}
