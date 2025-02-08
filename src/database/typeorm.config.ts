import { DataSource, DataSourceOptions } from 'typeorm';

let typeormConfig = {
  type: process.env.TYPEORM_TYPE,
  database: process.env.TYPEORM_DBNAME,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  synchronize: process.env.TYPEORM_SYNCHRONIZE || false,
  logging: true,
  entities: ['dist/**/*.entity{.ts,.js}'],
  autoLoadEntities: true,
  subscribers: ['dist/**/*.subscriber{.ts,.js}'],
  migrations: ['dist/**/migrations/*{.ts,.js}'],
  migrationsTableName: 'migration_history',
};

export default typeormConfig as DataSourceOptions;
export const dataSource = new DataSource(typeormConfig as DataSourceOptions);
