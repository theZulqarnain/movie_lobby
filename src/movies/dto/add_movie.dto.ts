import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class add_movie_dto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty()
  genre_ids: string[];

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  rating: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  link: string;
}
