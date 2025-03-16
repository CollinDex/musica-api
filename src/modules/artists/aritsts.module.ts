import { Module } from '@nestjs/common';
import { ArtistsController } from './aritsts.controller';
import { ArtistsService } from './aritsts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from './entities/artists.entity';
import { User } from '../users/entities/users.entity';
import { Song } from '../songs/entities/songs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Artist, User, Song])],
  controllers: [ArtistsController],
  providers: [ArtistsService],
})
export class ArtistsModule {}
