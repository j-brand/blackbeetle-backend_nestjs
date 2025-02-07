import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './entities/user.entity';
import { Album } from './entities/album.entity';
import { AlbumMedia } from './entities/album_media.entity';
import { Media } from './entities/media.entity';
import { MediaVariation } from './entities/media_variation.entity';
import { MediaSubscriber } from './subscribers/media.subscriber';
import { AlbumSubscriber } from './subscribers/album.subscriber';
import { Post } from '@entities/post.entity';
import { PostMedia } from '@entities/post_media.entity';
import { Story } from '@entities/story.entity';
import { Comment } from '@entities/comment.entity';

let typeormConfig = {
  type: process.env.TYPEORM_TYPE,
  database: process.env.TYPEORM_DBNAME,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  synchronize: process.env.TYPEORM_SYNCHRONIZE || false,
  logging: true,
  entities: ['dist/**/*.entity.js'],
  autoLoadEntities: true,
  subscribers: ['dist/**/*.subscriber.js'],
  //entities: [User, Album, Media, MediaVariation, AlbumMedia, Post, PostMedia, Story, Comment],
  migrations: ['dist/**/migrations/*.js'],
  migrationsTableName: 'migration_history',
};

export default typeormConfig as DataSourceOptions;
export const dataSource = new DataSource(typeormConfig as DataSourceOptions);
