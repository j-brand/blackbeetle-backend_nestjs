import { SqliteConnectionOptions } from "typeorm/driver/sqlite/SqliteConnectionOptions";
import { AlbumSubscriber } from "./subscribers/album.subscriber";
import { MediaSubscriber } from "./subscribers/media.subscriber";

export default (): SqliteConnectionOptions => ({
  type: 'sqlite',
  database: process.env.TYPEORM_DBNAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
  logging: process.env.TYPEORM_LOGGING === 'true',
  subscribers: [MediaSubscriber, AlbumSubscriber],
  migrations: ['@migrations/*.js'],
});
