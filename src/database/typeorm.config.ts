import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './entities/user.entity';
import 'dotenv/config';

const entities = [User];

console.log(process.env.COOKIE_KEY);

let typeormConfig = {
  synchronize: false,
  migrations: ['./migrations/*.js'],
  migrationsRun: true,
};

switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(typeormConfig, {
      type: 'sqlite',
      database: 'db.sqlite',
      entities: ['./entities/*.ts'],
    });
    break;
  case 'test':
    Object.assign(typeormConfig, {
      type: 'sqlite',
      database: 'test.sqlite',
      entities: entities,
    });
    break;
  case 'production':
    break;
  default:
    throw new Error('unknown environment');
}

export default typeormConfig;
export const dataSource = new DataSource(typeormConfig as DataSourceOptions);
