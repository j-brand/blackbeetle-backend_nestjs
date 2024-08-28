import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './entities/user.entity';
import { Album } from './entities/album.entity';
import { MediaVariation } from './entities/media_variation.entity';
import { Media } from './entities/media.entity';
import { AlbumMedia } from './entities/album_media.entity';

let typeormConfig = {
  type: process.env.TYPEORM_TYPE,
  database: process.env.TYPEORM_DBNAME,
  synchronize: process.env.TYPEORM_SYNCHRONIZE || false,
  //entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*.js'],
  entities: [User, Album, AlbumMedia, Media, MediaVariation],

  //migrationsRun: true,
};

export default typeormConfig as DataSourceOptions;
export const dataSource = new DataSource(typeormConfig as DataSourceOptions);
