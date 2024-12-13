import { Post } from '@entities/post.entity';
import { faker } from '@faker-js/faker';
import { Logger } from '@nestjs/common';
import { CommentsService } from '@stories/comments/comments.service';
import { CreateCommentDto } from '@stories/comments/dto/create-comment.dto';

export class CommentsSeeder {
  private posts: Post[] = [];

  constructor(private readonly commentsService: CommentsService) {}

  async seed(count: number, posts: Post[]) {
    this.posts = posts;

    const comments = Array.from({ length: count }, async () => {
      const commentData = this.getComment();
      return await this.commentsService.create(commentData);
    });
    Logger.log(`${count} comments created`, 'Comments Seeder');

    return Promise.all(comments);
  }

  private getComment(): CreateCommentDto {
    return {
      name: faker.person.fullName(),
      content: faker.lorem.paragraphs(1),
      post_id:
        this.posts[Math.floor(Math.random() * (this.posts.length - 1))].id,
    };
  }
}
