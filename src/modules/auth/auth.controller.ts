import { Body, Controller, Post, Request } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDTO } from '../users/dto/create-user-dto';
import { User } from '../users/entities/users.entity';
import { LoginDTO } from './dto/login.dto';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/metadata.decorator';
import { Enable2FAType } from 'src/common/types/auth-types';
import { UpdateResult } from 'typeorm';
import { ValidateTokenDTO } from './dto/validate-token.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Post('signup')
  signup(
    @Body()
    userDto: CreateUserDTO,
  ): Promise<User> {
    return this.userService.create(userDto);
  }

  @Public()
  @Post('login')
  login(
    @Body()
    loginDto: LoginDTO,
  ) {
    return this.authService.login(loginDto);
  }

  @Post('enable-2fa')
  enable2FA(
    @Request()
    req,
  ): Promise<Enable2FAType> {
    console.log(req.user);
    return this.authService.enable2FA(req.user.userId);
  }

  @Post('disable-2fa')
  disable2FA(
    @Request()
    req,
  ): Promise<UpdateResult> {
    console.log(req.user);
    return this.authService.disable2FA(req.user.userId);
  }

  @Post('validate-2fa')
  validate2FA(
    @Request()
    req,
    @Body()
    validateTokenDTO: ValidateTokenDTO,
  ): Promise<{ verified: boolean }> {
    return this.authService.validate2FAToken(
      req.user.userId,
      validateTokenDTO.token,
    );
  }
}
