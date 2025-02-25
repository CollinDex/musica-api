import { IsOptional, IsString, IsArray, IsDateString, IsMilitaryTime, IsIn } from "class-validator";


export class UpdateSongDto {
    
    @IsOptional()
    @IsString()
    readonly title;

    @IsOptional()
    @IsArray()
    @IsString({
    each: true
    })
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
    @IsIn(['Yes','No'], {
        message: 'Fav must be Yes or No'
    })
    readonly favorite?: 'Yes'| 'No';
}