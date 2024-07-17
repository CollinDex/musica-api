import { IsArray, IsDateString, IsIn, IsMilitaryTime, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateSongDTO {

    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @IsNotEmpty()
    @IsArray()
    @IsString({each:true})  
    readonly artists: string[];

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
    @IsIn(['Yes','No'], {
        message: 'Fav must be Yes or No'
    })
    readonly favorite?: 'Yes'| 'No';
}