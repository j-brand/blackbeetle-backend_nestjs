import {
  DataSource,
  DataSourceOptions,
} from 'typeorm';
import { User } from './entities/user.entity';
import { Album } from './entities/album.entity';
import { AlbumMedia } from './entities/album_media.entity';
import { Media } from './entities/media.entity';
import { MediaVariation } from './entities/media_variation.entity';
import { MediaSubscriber } from './subscribers/media.subscriber';
import { AlbumSubscriber } from './subscribers/album.subscriber';

let typeormConfig = {
  type: process.env.TYPEORM_TYPE,
  database: process.env.TYPEORM_DBNAME,
  synchronize: process.env.TYPEORM_SYNCHRONIZE || false,
  logging: true,
  entities: [__dirname + '/../**/*.entity.js'],
  subscribers: [MediaSubscriber, AlbumSubscriber],
  //entities: [User, Album, Media, MediaVariation, AlbumMedia],
  migrations: ['@migrations/*.js'],
};

export default typeormConfig as DataSourceOptions;
export const dataSource = new DataSource(typeormConfig as DataSourceOptions);
