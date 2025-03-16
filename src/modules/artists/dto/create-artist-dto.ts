import { IsArray, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateArtistDTO {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  songIds: number[];
}
