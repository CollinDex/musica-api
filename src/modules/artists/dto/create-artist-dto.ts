import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateArtistDTO {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  songIds: number[];
}
