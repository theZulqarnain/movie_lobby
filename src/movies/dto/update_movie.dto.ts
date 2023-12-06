import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class update_movie_dto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  _id: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  title: string;

  @IsArray()
  @IsOptional()
  @ApiProperty({ required: false })
  genre_ids: string[];

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  rating: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  link: string;
}
