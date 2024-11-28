import { INestApplicationContext } from '@nestjs/common';
import { UsersSeeder } from './users.seeder';
import { StoriesSeeder } from './stories.seeder';
import { UsersService } from '@users/users.service';
import { StoriesService } from '@stories/stories.service';
import { PostsSeeder } from './posts.seeder';
import { PostsService } from '@stories/posts/posts.service';
import { CommentsSeeder } from './comments.seeder';
import { CommentsService } from '@stories/comments/comments.service';
import { AlbumsSeeder } from './albums.seeder';
import { AlbumsService } from '@albums/albums.service';

export class Seeder {
  albumsSeeder:AlbumsSeeder;
  usersSeeder: UsersSeeder;
  storiesSeeder: StoriesSeeder;
  postsSeeder: PostsSeeder;
  commentsSeeder: CommentsSeeder;

  constructor(app: INestApplicationContext) {
    this.albumsSeeder = new AlbumsSeeder(app.get(AlbumsService));
    this.usersSeeder = new UsersSeeder(app.get(UsersService));
    this.storiesSeeder = new StoriesSeeder(app.get(StoriesService));
    this.postsSeeder = new PostsSeeder(app.get(PostsService));
    this.commentsSeeder = new CommentsSeeder(app.get(CommentsService));
  }

  async seed() {
    const albums = await this.albumsSeeder.seed(3);
    const users = await this.usersSeeder.seed(8);
    const stories = await this.storiesSeeder.seed(8);
    const posts = await this.postsSeeder.seed(20, users, stories);
    await this.commentsSeeder.seed(20, posts);
  }
}
