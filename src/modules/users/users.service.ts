import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { User } from './entities/users.entitiy';
import { CreateUserDTO } from './dto/create-user-dto';
import { UpdateUserDTO } from './dto/update-user-dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userDto: CreateUserDTO): Promise<User> {
    try {
      const user = new User();
      user.firstName = userDto.firstName;
      user.lastName = userDto.lastName;
      user.email = userDto.email;
      user.password = userDto.password;

      const existingUser = await this.userRepository.findOne({
        where: { email: user.email },
      });

      if (existingUser) {
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      }

      return await this.userRepository.save(user);
    } catch (error) {
      // Preserve known HTTP exceptions
      if (error instanceof HttpException) {
        throw error;
      }
      // Log unexpected errors and throw a generic error
      console.error('Unexpected error in create method:', error);
      throw new HttpException(
        'Error in DB while adding content',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throw new HttpException(
        'Error in DB while adding content',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findById(id: number): Promise<User> {
    try {
      return await this.userRepository.findOneBy({ id });
    } catch (error) {
      throw new HttpException(
        'Error in DB while adding content',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.userRepository.delete(id);
    } catch (error) {
      throw new HttpException(
        'Error in DB while adding content',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: number,
    recordToUpdate: UpdateUserDTO,
  ): Promise<UpdateResult> {
    try {
      return this.userRepository.update(id, recordToUpdate);
    } catch (error) {
      throw new HttpException(
        'Error in DB while adding content',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<User>> {
    //Paginate resp using pagination options
    //return paginate<Song>(this.songRepository, options);

    //Paginate using QueryBuilder
    const queryBuilder = this.userRepository.createQueryBuilder('c');
    queryBuilder.orderBy('c.firstName', 'DESC');
    return paginate<User>(queryBuilder, options);
  }
}
