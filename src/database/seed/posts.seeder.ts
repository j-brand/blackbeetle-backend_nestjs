import { Post, PostType } from '@entities/post.entity';
import { Story } from '@entities/story.entity';
import { User } from '@entities/user.entity';
import { faker } from '@faker-js/faker';
import { Logger } from '@nestjs/common';
import { CreatePostDto } from '@stories/posts/dto/create-post.dto';
import { PostsService } from '@stories/posts/posts.service';

export class PostsSeeder {
  users: User[] = [];
  stories: Story[] = [];

  constructor(private readonly postsService: PostsService) {}

  async seed(count: number, users: User[], stories: Story[]): Promise<Post[]> {
    this.users = users;
    this.stories = stories;

    const posts = Array.from({ length: count }, async () => {
      const postData = this.getPost();
      return await this.postsService.create(postData);
    });
    Logger.log(`${count} posts created`, 'Posts Seeder');

    return Promise.all(posts);
  }

  private getPost(): CreatePostDto {
    return {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(3),
      active: faker.datatype.boolean(),
      author: this.users[Math.floor(Math.random() * (this.users.length - 2))],
      story_id:
        this.stories[Math.floor(Math.random() * (this.stories.length - 1))].id,
      type: faker.helpers.enumValue(PostType),
      order: Math.floor(Math.random() * 100),
    };
  }
}
