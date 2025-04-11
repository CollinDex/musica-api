import { DataSource, DataSourceOptions } from 'typeorm';
import 'dotenv/config';
import { Song } from 'src/modules/songs/entities/songs.entity';
import { Artist } from 'src/modules/artists/entities/artists.entity';
import { User } from 'src/modules/users/entities/users.entity';
import { Playlist } from 'src/modules/playlists/entities/playlists.entity';

export const testDataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.TEST_PG_HOST,
  url: process.env.TEST_PG_URL,
  username: process.env.TEST_PG_USER,
  password: process.env.TEST_PG_PASSWORD,
  port: +process.env.TEST_PG_PORT,
  database: process.env.TEST_PG_DB,
  entities: [Song, Artist, User, Playlist],
  dropSchema: true,
  synchronize: true,
  migrations: ['dist/db/migrations/*.js'],
};

export const testDataSource = new DataSource(testDataSourceOptions);
