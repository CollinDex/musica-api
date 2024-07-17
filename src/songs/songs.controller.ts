import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDTO } from './dto/create-song-dto';
import { Song } from 'src/typeorm/entities/songs/songs.entity';
import { UpdateResult } from 'typeorm';
import { UpdateSongDto } from './dto/update-song-dto';

@Controller('songs')
export class SongsController {
    constructor(private songsService:SongsService) {}

    @Get()
    findAll(): Promise<Song[]> {
        try {
            return this.songsService.findAll();   
        } catch (error) {
            throw new HttpException(
                'server error',
                HttpStatus.INTERNAL_SERVER_ERROR,
                {
                    cause: error
                }
            );
        }
    }

    @Get(':id')
    findById(
        @Param(
            'id',
            new ParseIntPipe({
                errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
            }),
        )
        id: number,
    ): Promise<Song> {
        try {
            return this.songsService.findById(id);
        } catch (error) {
            throw new HttpException(
                'Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR,
                {
                    cause: error
                }
            );   
        }
    }

    @Post()
    createSong(@Body() CreateSongDTO: CreateSongDTO): Promise<Song> {
        try {
            const results = this.songsService.create(CreateSongDTO);
            return results;   
        } catch (error) {
            throw new HttpException(
                'Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR,
                {
                    cause: error
                }
            );
        }
    }

    @Put(':id')
    updateSong(
        @Param(
            'id',
            ParseIntPipe
        )
        id: number,
        @Body()
        updateSongDto: UpdateSongDto,
    ): Promise<UpdateResult> {
        try {
            return this.songsService.update(id, updateSongDto)
        } catch (error) {
            throw new HttpException(
                'Server Error',
                HttpStatus.INTERNAL_SERVER_ERROR,
                {
                    cause: error
                }
            );
        }
    }

    @Delete(':id')
    deleteSong(
        @Param(
            'id',
            ParseIntPipe
        )
        id: number
        ) {
            try {
                const results = this.songsService.delete(id);
                return results;   
            } catch (error) {
                throw new HttpException(
                    'Server Error',
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    {
                        cause: error
                    });
            }
    }
}
