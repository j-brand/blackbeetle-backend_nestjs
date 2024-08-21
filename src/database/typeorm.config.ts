import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './entities/user.entity';
import { Album } from './entities/album.entity';

const entities = [User, Album];

let typeormConfig = {
  type: process.env.TYPEORM_TYPE,
  database: process.env.TYPEORM_DBNAME,
  synchronize: process.env.TYPEORM_SYNCHRONIZE || false,
  //entities: [__dirname + '/**/*.entity{.ts,.js}'],
  //migrations: ['./migrations/*.js'],
  entities: [User, Album],

  //migrationsRun: true,
};

export default typeormConfig as DataSourceOptions;
export const dataSource = new DataSource(typeormConfig as DataSourceOptions);
