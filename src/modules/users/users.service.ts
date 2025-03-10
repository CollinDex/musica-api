import { Injectable } from '@nestjs/common';
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

      return await this.userRepository.save(user);
    } catch (error) {
      throw new Error('Error in Db while adding content');
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throw new Error('Error in Db while fetching content');
    }
  }

  async findById(id: number): Promise<User> {
    try {
      return await this.userRepository.findOneBy({ id });
    } catch (error) {
      throw new Error('Error in Db while fetching content');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.userRepository.delete(id);
    } catch (error) {
      throw new Error('Error Deleting Content');
    }
  }

  async update(
    id: number,
    recordToUpdate: UpdateUserDTO,
  ): Promise<UpdateResult> {
    try {
      return this.userRepository.update(id, recordToUpdate);
    } catch (error) {
      throw new Error('Error Updating Content');
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
