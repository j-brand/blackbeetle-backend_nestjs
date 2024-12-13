import { forwardRef, Module, ValidationPipe } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '@entities/comment.entity';
import { PostsModule } from '@stories/posts/posts.module';
import { APP_PIPE } from '@nestjs/core';
import { PublicCommentsController } from './public-comments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), PostsModule],
  controllers: [CommentsController, PublicCommentsController],
  providers: [
    CommentsService,
    { provide: APP_PIPE, useValue: new ValidationPipe({ transform: true }) },
  ],
})
export class CommentsModule {}
