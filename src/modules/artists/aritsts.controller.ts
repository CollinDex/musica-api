import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  DefaultValuePipe,
  Query,
} from '@nestjs/common';
import { ArtistsService } from './aritsts.service';
import { CreateArtistDTO } from './dto/create-artist-dto';
import { Artist } from './entities/artists.entities';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('artists')
export class ArtistsController {
  constructor(private artistsService: ArtistsService) {}

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number = 1,

    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit: number = 10,
  ): Promise<Pagination<Artist>> {
    //Pagination
    limit = limit > 100 ? 100 : limit;
    return this.artistsService.paginate({
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
  ): Promise<Artist> {
    return this.artistsService.findById(id);
  }

  @Post()
  createArtist(@Body() createArtistDTO: CreateArtistDTO): Promise<Artist> {
    const results = this.artistsService.create(createArtistDTO);
    return results;
  }

  @Delete(':id')
  deleteArtist(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    const results = this.artistsService.delete(id);
    return results;
  }
}
