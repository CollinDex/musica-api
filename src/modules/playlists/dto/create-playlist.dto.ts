import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePlaylistDto {
  @IsNotEmpty()
  @IsString()
  readonly name;

  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  readonly songs;

  @IsNotEmpty()
  @IsNumber()
  readonly user: number;
}
