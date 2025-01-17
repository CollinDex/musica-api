import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { SongsController } from './songs/songs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Song } from './typeorm/entities/songs/songs.entity';

@Module({
  imports: [
    SongsModule,
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.PG_HOST,
      url: process.env.PG_URL,
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      port: +process.env.PG_PORT,
      database: process.env.PG_DB,
      entities: [Song],
      synchronize: process.env.NODE_ENV === 'production' ? false : true,
      ssl: {
        rejectUnauthorized: true,
      },
    })
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
    consumer.apply(LoggerMiddleware).forRoutes(SongsController); //3
  }
}
