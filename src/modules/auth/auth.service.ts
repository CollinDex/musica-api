import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDTO): Promise<{ accessToken: string }> {
    try {
      const user = await this.userService.findOne(loginDto);

      const passwordMatched = await bcrypt.compare(
        loginDto.password,
        user.password,
      );

      if (passwordMatched) {
        delete user.password;
        const payload = { email: user.email, id: user.id };
        return {
          accessToken: this.jwtService.sign(payload),
        };
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
