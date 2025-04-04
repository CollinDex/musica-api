import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { Playlist } from './entities/playlists.entity';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { User } from '../users/entities/users.entity';
import { Song } from '../songs/entities/songs.entity';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
  ) {}

  async create(playlistDto: CreatePlaylistDto): Promise<Playlist> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: playlistDto.user },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const songs = await this.songRepository.findBy({
        id: In(playlistDto.songs || []),
      });

      if (!songs.length && playlistDto.songs) {
        throw new HttpException('No valid songs found', HttpStatus.BAD_REQUEST);
      }

      const playlist = this.playlistRepository.create({
        name: playlistDto.name,
        user,
        songs,
      });

      const existingPlaylist = await this.playlistRepository.findOne({
        where: { name: playlist.name },
      });

      if (existingPlaylist) {
        throw new HttpException('Playlist already exists', HttpStatus.CONFLICT);
      }

      return await this.playlistRepository.save(playlist);
    } catch (error) {
      // Preserve known HTTP exceptions
      if (error instanceof HttpException) {
        throw error;
      }
      // Log unexpected errors and throw a generic error
      console.error('Unexpected error in create artist method:', error);
      throw new HttpException(
        'Error in DB while adding content',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<Playlist[]> {
    try {
      return await this.playlistRepository.find({
        relations: ['songs', 'user'],
      });
    } catch (error) {
      // Preserve known HTTP exceptions
      if (error instanceof HttpException) {
        throw error;
      }
      // Log unexpected errors and throw a generic error
      console.error('Unexpected error in create playlist method:', error);
      throw new HttpException(
        'Error in DB while adding content',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findById(id: number): Promise<Playlist> {
    try {
      return await this.playlistRepository.findOneBy({ id });
    } catch (error) {
      // Preserve known HTTP exceptions
      if (error instanceof HttpException) {
        throw error;
      }
      // Log unexpected errors and throw a generic error
      console.error('Unexpected error in create artist method:', error);
      throw new HttpException(
        'Error in DB while adding content',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.playlistRepository.delete(id);
    } catch (error) {
      // Preserve known HTTP exceptions
      if (error instanceof HttpException) {
        throw error;
      }
      // Log unexpected errors and throw a generic error
      console.error('Unexpected error in create artist method:', error);
      throw new HttpException(
        'Error in DB while adding content',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Playlist>> {
    //Paginate resp using pagination options
    //return paginate<Song>(this.songRepository, options);

    //Paginate using QueryBuilder
    const queryBuilder = this.playlistRepository.createQueryBuilder('playlist');
    queryBuilder
      .leftJoinAndSelect('playlist.songs', 'song')
      .orderBy('playlist.name', 'DESC');
    return paginate<Playlist>(queryBuilder, options);
  }
}

//TODO: Refactor createPlaylist to use id from jwt
//TODO: Refactor createSong to use id from jwt
//TODO: Refactor all services to use id from jwt
//TODO: Refactor all paginate to user proper naming (eg: findAll) and comment out unused code
//TODO: Refactor all other pagination to use proper naming
