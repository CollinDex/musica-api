import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserRole } from 'src/common/types/interface';

export class CreateUserDTO {
  @ApiProperty({
    example: 'Jane',
    description: 'Provide the first name of the user',
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    example: 'Ahuchaogu',
    description: 'Provide the first name of the user',
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    example: 'janedoe@gmail.com',
    description: 'email',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'test123',
    description: 'password',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    example: 'artist',
    description: 'role',
  })
  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;
}
