import { Injectable } from '@nestjs/common';
import { Song } from 'src/typeorm/entities/songs/songs.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateSongDTO } from './dto/create-song-dto';
import { UpdateSongDto } from './dto/update-song-dto';

@Injectable()
export class SongsService {
    constructor(
        @InjectRepository(Song)
        private songRepository: Repository<Song>
    ) {}

    async create(songDto: CreateSongDTO): Promise<Song> {

        try {
            // Add a song to the database
            const song = new Song;
            song.title = songDto.title;
            song.artists = songDto.artists;
            song.duration = songDto.duration;
            song.lyrics = songDto.lyrics;
            song.releasedDate = songDto.releasedDate;
            song.favorite = songDto.favorite;
            
            return await this.songRepository.save(song);    
        } catch (error) {
            throw new Error('Error in Db while adding content');
        }
    }

    async findAll(): Promise<Song[]> {
        try {
            //Return all the stored songs
            return await this.songRepository.find();   
        } catch (error) {
            throw new Error('Error in Db while fetching content')
        }
    }

    async findById(id: number): Promise<Song> {
        try {
            return this.songRepository.findOneBy({id});
        } catch (error) {
            throw new Error('Error in Db while fetching content')
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await this.songRepository.delete(id);
        } catch (error) {
            throw new Error('Error Deleting Content');
        }
    }

    async update(id: number, recordToUpdate: UpdateSongDto): Promise<UpdateResult> {
        try {
            return this.songRepository.update(id, recordToUpdate)
        } catch (error) {
            throw new Error('Error Deleting Content');
        }
    }
}