import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDTO } from '../users/dto/create-user-dto';
import { User } from '../users/entities/users.entity';
import { LoginDTO } from './dto/login.dto';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/metadata.decorator';
import { Enable2FAType } from 'src/common/types/auth-types';
import { UpdateResult } from 'typeorm';
import { ValidateTokenDTO } from './dto/validate-token.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'It will return the user in the response',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid Input',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @Public()
  @Post('signup')
  signup(
    @Body()
    userDto: CreateUserDTO,
  ): Promise<User> {
    return this.userService.signUp(userDto);
  }

  @ApiOperation({ summary: 'Logs a user in' })
  @ApiResponse({
    status: 200,
    description:
      'It will return an access token which can be used to access the users data',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid Input',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @Public()
  @Post('login')
  login(
    @Body()
    loginDto: LoginDTO,
  ) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'Validate ApiKey' })
  @ApiResponse({
    status: 200,
    description: 'It will return the users data',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid Input',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @Public()
  @Get('validateApiKey')
  @UseGuards(AuthGuard('bearer'))
  getProfile(
    @Request()
    req,
  ) {
    return {
      msg: 'authenticated with apikey',
      user: req.user,
    };
  }

  @ApiOperation({ summary: 'Enable 2fa' })
  @ApiResponse({
    status: 200,
    description: 'Enables 2FA and Returns 2FA Secret Key',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid Input',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @Post('enable-2fa')
  enable2FA(
    @Request()
    req,
  ): Promise<Enable2FAType> {
    console.log(req.user);
    return this.authService.enable2FA(req.user.userId);
  }

  @ApiOperation({ summary: 'Disable 2fa' })
  @ApiResponse({
    status: 204,
    description: 'Disabled 2fa',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @Post('disable-2fa')
  disable2FA(
    @Request()
    req,
  ): Promise<UpdateResult> {
    console.log(req.user);
    return this.authService.disable2FA(req.user.userId);
  }

  @ApiOperation({ summary: 'Validate 2FA code' })
  @ApiResponse({
    status: 200,
    description: 'It will return the users data',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid Input',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
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
