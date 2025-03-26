import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.PG_HOST,
  url: process.env.PG_URL,
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  port: +process.env.PG_PORT,
  database: process.env.PG_DB,
  entities: ['dist/**/*.entitiy.js'],
  synchronize: false,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: true }
      : false,
  migrations: ['dist/db/migrations/*.js'],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
