import {
  IsOptional,
  IsString,
  IsArray,
  IsDateString,
  IsMilitaryTime,
  IsIn,
  IsNumber,
} from 'class-validator';

export class UpdateSongDto {
  @IsOptional()
  @IsString()
  readonly title: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  readonly artists;

  @IsOptional()
  @IsDateString()
  readonly releasedDate: Date;

  @IsOptional()
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
  readonly favorite?: string; //TODO: Update this to boolean
}
