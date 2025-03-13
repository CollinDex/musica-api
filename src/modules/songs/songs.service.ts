import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, UpdateResult } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { Song } from './entities/songs.entity';
import { CreateSongDTO } from './dto/create-song-dto';
import { UpdateSongDto } from './dto/update-song-dto';
import { Artist } from '../artists/entities/artists.entities';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
  ) {}

  async create(songDto: CreateSongDTO): Promise<Song> {
    try {
      // Add a song to the database
      const song = new Song();
      song.title = songDto.title;
      song.artists = songDto.artists;
      song.duration = songDto.duration;
      song.lyrics = songDto.lyrics;
      song.releasedDate = songDto.releasedDate;
      song.favorite = songDto.favorite;

      const artists = await this.artistRepository.findBy({
        id: In(songDto.artists),
      });
      song.artists = artists;

      return await this.songRepository.save(song);
    } catch (error) {
      throw new Error('Error in Db while adding content');
    }
  }

  async findAll(): Promise<Song[]> {
    try {
      return await this.songRepository.find();
    } catch (error) {
      throw new Error('Error in Db while fetching content');
    }
  }

  async findById(id: number): Promise<Song> {
    try {
      return await this.songRepository.findOneBy({ id });
    } catch (error) {
      throw new Error('Error in Db while fetching content');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.songRepository.delete(id);
    } catch (error) {
      throw new Error('Error Deleting Content');
    }
  }

  async update(
    id: number,
    recordToUpdate: UpdateSongDto,
  ): Promise<UpdateResult> {
    try {
      const existingSong = await this.songRepository.findOne({
        where: { id: id },
      });

      if (!existingSong) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (Object.values(recordToUpdate).length === 0) {
        throw new HttpException('No supplied data', HttpStatus.BAD_REQUEST);
      }

      return this.songRepository.update(id, recordToUpdate);
    } catch (error) {
      throw error;
    }
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Song>> {
    //Paginate resp using pagination options
    //return paginate<Song>(this.songRepository, options);

    //Paginate using QueryBuilder
    const queryBuilder = this.songRepository.createQueryBuilder('c');
    queryBuilder.orderBy('c.releasedDate', 'DESC');
    return paginate<Song>(queryBuilder, options);
  }
}
