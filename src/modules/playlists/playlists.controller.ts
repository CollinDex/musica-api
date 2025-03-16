import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Playlist } from './entities/playlists.entity';

@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number = 1,

    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit: number = 10,
  ): Promise<Pagination<Playlist>> {
    //Pagination
    limit = limit > 100 ? 100 : limit;
    return this.playlistsService.paginate({
      page,
      limit,
    });
    //return this.usersService.findAll();
  }

  @Get(':id')
  findById(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    id: number,
  ): Promise<Playlist> {
    return this.playlistsService.findById(id);
  }

  @Post()
  createPlayist(
    @Body() createPlaylistDto: CreatePlaylistDto,
  ): Promise<Playlist> {
    const results = this.playlistsService.create(createPlaylistDto);
    return results;
  }

  @Delete(':id')
  deletePlayist(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    const results = this.playlistsService.delete(id);
    return results;
  }
}
