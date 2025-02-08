import { SqliteConnectionOptions } from "typeorm/driver/sqlite/SqliteConnectionOptions";

export default (): SqliteConnectionOptions => ({
  type: 'sqlite',
  database: process.env.TYPEORM_DBNAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
  logging: process.env.TYPEORM_LOGGING === 'true',
  subscribers: [__dirname + '/../subscribers/*.subscriber{.ts,.js}'],
  migrations: ['@migrations/*.js'],
});
