import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/users.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async login(loginDto: LoginDTO): Promise<User> {
    try {
      const user = await this.userService.findOne(loginDto);

      const passwordMatched = await bcrypt.compare(
        loginDto.password,
        user.password,
      );

      if (passwordMatched) {
        delete user.password;
        return user;
      } else {
        throw new HttpException(
          'Password does not match',
          HttpStatus.UNAUTHORIZED,
        );
      }
    } catch (error) {
      // Preserve known HTTP exceptions
      if (error instanceof HttpException) {
        throw error;
      }
      // Log unexpected errors and throw a generic error
      console.error('Unexpected error in auth service:', error);
      throw new HttpException(
        'Error in Auth Service',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
