import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '../middlewares/auth.guard';
import { filterProperties } from '../utils/functions/functions.utility';
import { add_movie_dto } from './dto/add_movie.dto';
import { update_movie_dto } from './dto/update_movie.dto';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) { }

  @Get('/')
  @ApiQuery({ name: 'q', required: false })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  getMovies(@Query('q') query: string) {
    return this.moviesService.get_movies({ query });
  }

  @Post('/')
  @UseGuards(AuthGuard)
  @ApiBody({ type: add_movie_dto })
  @ApiResponse({ status: 201, description: 'Movie successfully added' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  // adding Headers to show on swagger
  add_movie(@Body() body: add_movie_dto, @Headers('roles') roles: string) {
    const filteredBody = filterProperties(body, add_movie_dto);
    return this.moviesService.add_movie(filteredBody);
  }

  @Put('/')
  @UseGuards(AuthGuard)
  @ApiBody({ type: update_movie_dto })
  @ApiResponse({ status: 201, description: 'Movie successfully updated' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  // adding Headers to show on swagger
  update_movie(@Body() body: update_movie_dto, @Headers('roles') roles: string) {
    const filteredBody = filterProperties(body, update_movie_dto);
    return this.moviesService.update_movie(filteredBody);
  }

  @Delete('/:id')
  @ApiParam({ name: 'id', description: 'The ID of the movie to delete' })
  @ApiResponse({ status: 200, description: 'Movie successfully deleted' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  // adding Headers to show on swagger
  deleteMovie(@Param('id') id: string, @Headers('roles') roles: string) {
    return this.moviesService.delete_movie({ param: { id } });
  }
}
