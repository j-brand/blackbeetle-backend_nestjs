import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

export default (): MysqlConnectionOptions => ({
  type: 'mariadb',
  host: process.env.TYPEORM_HOST,
  port: parseInt(process.env.TYPEORM_DBPORT),
  database: process.env.TYPEORM_DBNAME,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
  logging: false,
  entities: [__dirname + '/../**/*.entity.js'],
  subscribers: [__dirname + '/../subscribers/*.subscriber.js'],
  migrations: ['@migrations/*.js'],
});
