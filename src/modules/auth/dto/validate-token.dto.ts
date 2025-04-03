import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateTokenDTO {
  @ApiProperty({
    example: 'asdfaeljwoef9asijfoie9w8uoufosdfasdfasd',
    description: 'token',
  })
  @IsNotEmpty()
  @IsString()
  token: string;
}
