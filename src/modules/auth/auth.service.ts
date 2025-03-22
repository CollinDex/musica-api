import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import * as speakeasy from 'speakeasy';
import { JwtService } from '@nestjs/jwt';
import { ArtistsService } from '../artists/aritsts.service';
import { UserRole } from 'src/common/types/interface';
import { Enable2FAType } from 'src/common/types/auth-types';
import { UpdateResult } from 'typeorm';
import { User } from '../users/entities/users.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private artistService: ArtistsService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDTO): Promise<
    | { accessToken: string }
    | {
        validate2FA: string;
        message: string;
      }
  > {
    try {
      const user = await this.userService.findOne(loginDto);

      // Verify password
      const passwordMatched = await bcrypt.compare(
        loginDto.password,
        user.password,
      );
      if (!passwordMatched) {
        throw new HttpException(
          'Password does not match',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // Remove sensitive information
      delete user.password;

      // Define a base payload
      let payload = { email: user.email, userId: user.id, role: user.role };

      if (user.enable2FA && user.twoFASecret) {
        return {
          validate2FA: 'http://localhost:3000/auth/validate-2fa',
          message:
            'Please send the one-time password/token from your Authenticator app',
        };
      }

      // Role-based token modifications
      const roleHandlers = {
        [UserRole.ARTIST]: async () => {
          const artist = await this.artistService.findById(user.id);
          return { ...payload, artistId: artist.id };
        },
        [UserRole.USER]: async () => payload,
      };

      // Execute the appropriate role handler or default to an error
      payload = roleHandlers[user.role]
        ? await roleHandlers[user.role]()
        : payload;

      return { accessToken: this.jwtService.sign(payload) };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Unexpected error in auth service:', error);
      throw new HttpException(
        'Error in Auth Service',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async enable2FA(userId: number): Promise<Enable2FAType> {
    const user = await this.userService.findById(userId);
    if (user.enable2FA) {
      return { secret: user.twoFASecret };
    }
    const secret = speakeasy.generateSecret();
    console.info(secret);
    user.twoFASecret = secret.base32;
    await this.userService.enable2FA(user.id, user.twoFASecret);
    return { secret: user.twoFASecret };
  }

  async disable2FA(userId: number): Promise<UpdateResult> {
    return this.userService.disable2FA(userId);
  }

  async validate2FAToken(
    userId: number,
    token: string,
  ): Promise<{ verified: boolean }> {
    try {
      const user = await this.userService.findById(userId);
      const verified = speakeasy.totp.verify({
        secret: user.twoFASecret,
        token: token,
        encoding: 'base32',
      });

      if (verified) {
        return { verified: true };
      } else {
        return { verified: false };
      }
    } catch (error) {
      // Preserve known HTTP exceptions
      if (error instanceof HttpException) {
        throw error;
      }
      // Log unexpected errors and throw a generic error
      console.error('Unexpected error in auth service:', error);
      throw new HttpException(
        'Error verifying token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async validateUserByApiKey(apiKey: string): Promise<User> {
    return this.userService.findByApiKey(apiKey);
  }
}
