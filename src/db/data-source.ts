import { Artist } from 'src/modules/artists/entities/artists.entity';
import { Playlist } from 'src/modules/playlists/entities/playlists.entity';
import { Song } from 'src/modules/songs/entities/songs.entity';
import { User } from 'src/modules/users/entities/users.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.PG_HOST,
  url: process.env.PG_URL,
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  port: +process.env.PG_PORT,
  database: process.env.PG_DB,
  entities: [Song, User, Artist, Playlist],
  synchronize: process.env.NODE_ENV === 'production' ? false : true,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: true }
      : false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
