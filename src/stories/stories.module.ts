import { Module } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { StoriesController } from './stories.controller';
import { Story } from '@entities/story.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [TypeOrmModule.forFeature([Story]), PostsModule],
  controllers: [StoriesController],
  providers: [StoriesService],
})
export class StoriesModule {}
