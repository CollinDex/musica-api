import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './modules/songs/songs.module';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Song } from './modules/songs/entities/songs.entity';
import { User } from './modules/users/entities/users.entity';
import { Artist } from './modules/artists/entities/artists.entity';
import { UsersModule } from './modules/users/users.module';
import { ArtistsModule } from './modules/artists/aritsts.module';
import { Playlist } from './modules/playlists/entities/playlists.entity';
import { PlaylistsModule } from './modules/playlists/playlists.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    SongsModule,
    UsersModule,
    ArtistsModule,
    PlaylistsModule,
    AuthModule,
    TypeOrmModule.forRoot({
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
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {
    console.log(dataSource.driver.database);
  }

  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerMiddleware).forRoutes('songs'); //1
    //consumer.apply(LoggerMiddleware).forRoutes({path:'songs', method: RequestMethod.POST}) //2
    //consumer.apply(LoggerMiddleware).forRoutes(SongsController); //3
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
