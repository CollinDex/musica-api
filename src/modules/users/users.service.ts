import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { User } from './entities/users.entity';
import { CreateUserDTO } from './dto/create-user-dto';
import { UpdateUserDTO } from './dto/update-user-dto';
import * as bcrypt from 'bcryptjs';
import { v4 as uuid4 } from 'uuid';
import { LoginDTO } from '../auth/dto/login.dto';
import { UserRole } from 'src/common/types/interface';
import { ArtistsService } from '../artists/aritsts.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private artistService: ArtistsService,
  ) {}

  async signUp(userDto: CreateUserDTO): Promise<User> {
    try {
      const salt = await bcrypt.genSalt();
      userDto.password = await bcrypt.hash(userDto.password, salt);

      const user = new User();
      user.firstName = userDto.firstName;
      user.lastName = userDto.lastName;
      user.email = userDto.email;
      user.password = userDto.password;
      user.apiKey = uuid4();
      user.role = userDto.role;

      const userExists = await this.userRepository.findOne({
        where: { email: user.email },
      });

      if (userExists) {
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      }

      const savedUser = await this.userRepository.save(user);

      if (userDto.role === UserRole.ARTIST) {
        await this.artistService.create({
          userId: savedUser.id,
        });
      }

      delete user.password;
      return user;
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

  async enable2FA(userId: number, secret: string): Promise<UpdateResult> {
    return this.userRepository.update(
      { id: userId },
      {
        twoFASecret: secret,
        enable2FA: true,
      },
    );
  }

  async disable2FA(userId: number): Promise<UpdateResult> {
    return this.userRepository.update(
      { id: userId },
      {
        enable2FA: false,
      },
    );
  }

  async findByApiKey(apiKey: string): Promise<User> {
    return await this.userRepository.findOneBy({ apiKey });
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

  async findOne(userDto: LoginDTO): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { email: userDto.email },
      });

      if (!user) {
        throw new HttpException('User not Found', HttpStatus.NOT_FOUND);
      }

      return user;
    } catch (error) {
      // Preserve known HTTP exceptions
      if (error instanceof HttpException) {
        throw error;
      }
      // Log unexpected errors and throw a generic error
      console.error('Unexpected error in auth service:', error);
      throw new HttpException(
        'Error in Users Service',
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
      const existingUser = await this.userRepository.findOne({
        where: { id: id },
      });

      if (!existingUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (Object.values(recordToUpdate).length === 0) {
        throw new HttpException('No supplied data', HttpStatus.BAD_REQUEST);
      }

      return await this.userRepository.update(id, recordToUpdate);
    } catch (error) {
      throw error;
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
