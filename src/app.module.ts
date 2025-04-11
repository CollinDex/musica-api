import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './modules/songs/songs.module';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsersModule } from './modules/users/users.module';
import { ArtistsModule } from './modules/artists/aritsts.module';
import { PlaylistsModule } from './modules/playlists/playlists.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './common/guards/auth.guard';
import { dataSourceOptions } from './db/data-source';
//import { SeedModule } from './modules/seed/seed.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    SongsModule,
    UsersModule,
    ArtistsModule,
    PlaylistsModule,
    AuthModule,
    ConfigModule.forRoot({ envFilePath: ['.env'] }),
    TypeOrmModule.forRoot(dataSourceOptions),
    //SeedModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: JwtAuthGuard,
    },
    AppService,
  ],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {
    console.info(`Connected to ${dataSource.driver.database}`);
  }

  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerMiddleware).forRoutes('songs'); //1
    //consumer.apply(LoggerMiddleware).forRoutes({path:'songs', method: RequestMethod.POST}) //2
    //consumer.apply(LoggerMiddleware).forRoutes(SongsController); //3
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
