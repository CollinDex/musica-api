import {
  IsArray,
  IsDateString,
  IsIn,
  IsMilitaryTime,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSongDTO {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  readonly artists;

  @IsNotEmpty()
  @IsDateString()
  readonly releasedDate: Date;

  @IsMilitaryTime()
  readonly duration: Date;

  @IsOptional()
  @IsString()
  readonly lyrics: string;

  @IsOptional()
  @IsString()
  @IsIn(['Yes', 'No'], {
    message: 'Fav must be Yes or No',
  })
  readonly favorite?: 'Yes' | 'No';
}
