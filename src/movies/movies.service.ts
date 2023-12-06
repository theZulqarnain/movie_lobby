import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CODE_TECH_ISSUES, MONGODB_PROVIDER } from '../configs/constants';
import { Connection } from 'mongoose';
import { Movie } from './movies.model';
import { Cache } from 'cache-manager';
import { add_movie_dto } from './dto/add_movie.dto';
import { IMovie } from 'src/utils/interfaces/movie.interface';

@Injectable()
export class MoviesService {
  constructor(
    @Inject(MONGODB_PROVIDER) readonly connection: Connection,
    @Inject('CACHE_MANAGER') private readonly cacheManager: Cache,
  ) { }

  async get_movies(data: {
    query?: string;
  }): Promise<{ message: string; data: any[] }> {
    const { query } = data;
    try {
      const model = new Movie(this.connection);
      if (query) {
        // cache implement
        const cacheKey = `movie_${query}`;

        // Try to get data from cache
        const cachedMovie: any = await this.cacheManager.get<Movie>(cacheKey);

        if (cachedMovie) {
          return {
            message: 'success',
            data: cachedMovie,
          };
        }
        const movie = await model.getMovie(query);
        if (!movie) {
          throw new HttpException('Movie not found', 404);
        }
        // Store the data in cache for future requests
        await this.cacheManager.set(cacheKey, movie);

        return {
          message: 'success',
          data: movie,
        };
      } else {
        const movies = await model.getMovies();
        if (!movies) {
          throw new HttpException('Movies not found', 404);
        }
        return {
          message: 'success',
          data: movies,
        };
      }
    } catch (e) {
      throw new HttpException(CODE_TECH_ISSUES, 412);
    }
  }

  async add_movie(data: add_movie_dto): Promise<{ message: string; data: {} }> {
    const { title, genre_ids, rating, link } = data;
    try {
      const model = new Movie(this.connection);
      const movie = {} as IMovie;
      movie.title = title;
      movie.genre_ids = genre_ids;
      movie.rating = rating;
      movie.link = link;
      const res = await model.addMovie(movie);
      if (!res) {
        throw new HttpException('Failed to create movie', 500);
      }

      return {
        message: 'Movie successfully created',
        data: {},
      };
    } catch (e) {
      throw new HttpException(CODE_TECH_ISSUES, 412);
    }
  }

  async update_movie(data: any): Promise<{ message: string; data: IMovie }> {
    try {
      const model = new Movie(this.connection);
      const updated_movie = await model.updateMovie(data);
      if (!updated_movie) {
        throw new HttpException('Failed to update movie', 500);
      }

      return {
        message: 'Movie successfully updated',
        data: updated_movie,
      };
    } catch (e) {
      throw new HttpException(CODE_TECH_ISSUES, 412);
    }
  }

  async delete_movie(data: {
    param: { id: string };
  }): Promise<{ message: string; data: {} }> {
    const { id } = data.param;
    try {
      const model = new Movie(this.connection);
      const res = await model.deleteMovie(id);
      if (!res) {
        throw new HttpException('Failed to delete movie', 500);
      }

      return {
        message: 'Movie successfully deleted',
        data: {},
      };
    } catch (e) {
      throw new HttpException(CODE_TECH_ISSUES, 412);
    }
  }
}
