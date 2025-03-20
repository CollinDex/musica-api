import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { Artist } from './entities/artists.entity';
import { CreateArtistDTO } from './dto/create-artist-dto';
import { User } from '../users/entities/users.entity';
import { Song } from '../songs/entities/songs.entity';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
  ) {}

  async create(artistDto: Partial<CreateArtistDTO>): Promise<Artist> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: artistDto.userId },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const songs = await this.songRepository.findBy({
        id: In(artistDto.songIds || []),
      });

      if (!songs.length && artistDto.songIds) {
        throw new HttpException('No valid songs found', HttpStatus.BAD_REQUEST);
      }

      const artist = this.artistRepository.create({
        user,
        songs,
      });

      console.log('artistDto:', artistDto);
      console.log('artist:', artist);

      const existingAritst = await this.artistRepository.findOne({
        where: { user: artist.user },
      });

      console.log('ExistingArtist', existingAritst);
      console.log('ExistingArtistId', artist.user);

      if (existingAritst) {
        throw new HttpException('Artist already exists', HttpStatus.CONFLICT);
      }

      return await this.artistRepository.save(artist);
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

  async findAll(): Promise<Artist[]> {
    try {
      return await this.artistRepository.find();
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

  async findById(userId: number): Promise<Artist> {
    try {
      console.log('userid', userId);
      const artist = await this.artistRepository.findOneBy({
        user: { id: userId },
      });
      console.log(artist);
      return artist;
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
      await this.artistRepository.delete(id);
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

  async paginate(options: IPaginationOptions): Promise<Pagination<Artist>> {
    //Paginate resp using pagination options
    //return paginate<Song>(this.songRepository, options);

    //Paginate using QueryBuilder
    const queryBuilder = this.artistRepository.createQueryBuilder('c');
    queryBuilder.orderBy('c.user', 'DESC');
    return paginate<Artist>(queryBuilder, options);
  }
}
