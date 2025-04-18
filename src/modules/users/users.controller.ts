import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Put,
  DefaultValuePipe,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/users.entity';
import { UpdateResult } from 'typeorm';
import { UpdateUserDTO } from './dto/update-user-dto';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number = 1,

    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit: number = 10,
  ): Promise<Pagination<User>> {
    //Pagination
    limit = limit > 100 ? 100 : limit;
    return this.usersService.paginate({
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
  ): Promise<User> {
    return this.usersService.findById(id);
  }

  @Put(':id')
  updateUser(
    @Param('id', ParseIntPipe)
    id: number,
    @Body()
    updateUserDto: UpdateUserDTO,
  ): Promise<UpdateResult> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  deleteUser(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    const results = this.usersService.delete(id);
    return results;
  }
}
