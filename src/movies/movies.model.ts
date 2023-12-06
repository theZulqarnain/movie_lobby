import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { Connection, Document, Types } from 'mongoose';
import { IMovie } from 'src/utils/interfaces/movie.interface';
import { MONGODB_PROVIDER } from '../configs/constants';

export class Movie {
  constructor(@Inject(MONGODB_PROVIDER) readonly connection: Connection) { }

  async getMovies(): Promise<Document[]> {
    try {
      const cursor: any = await this.connection.collection('movies').aggregate([
        {
          $lookup: {
            from: 'genres',
            localField: 'genre_ids',
            foreignField: 'id',
            as: 'genres',
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            rating: 1,
            link: 1,
            genres: '$genres.name',
          },
        },
      ]);
      const result: Document[] = await cursor.toArray();
      return result;
    } catch (e) {
      throw new HttpException(
        'Something went wrong ' + e,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getMovie(searchText: string): Promise<any | null> {
    try {
      const genres = await this.connection
        .collection('genres')
        .find({ name: { $regex: searchText, $options: 'i' } })
        .toArray();

      const movies = await this.connection
        .collection('movies')
        .aggregate([
          {
            $match: {
              $or: [
                { title: { $regex: searchText, $options: 'i' } },
                { genre_ids: { $in: genres.map((genre) => genre.id) } },
              ],
            },
          },
          {
            $lookup: {
              from: 'genres',
              localField: 'genre_ids',
              foreignField: 'id',
              as: 'genres',
            },
          },
        ])
        .toArray();

      if (movies.length === 0) {
        return null;
      }

      const movie = movies[0];

      return {
        _id: movie._id,
        title: movie.title,
        rating: movie.rating,
        link: movie.link,
        genres: movie.genres.map((genre: any) => genre.name),
      };
    } catch (e) {
      throw new HttpException(
        'Something went wrong ' + e,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addMovie(data: IMovie): Promise<boolean | null> {
    try {
      const result: any = await this.connection
        .collection('movies')
        .insertOne(data);

      if (result.acknowledged) {
        return true;
      } else {
        return null;
      }
    } catch (e) {
      throw new HttpException(
        'Something went wrong ' + e,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateMovie(data: IMovie): Promise<any | null> {
    try {
      const { _id, ...updateData } = data; // Exclude _id from the update data
      const result: any = await this.connection
        .collection('movies')
        .updateOne({ _id: new Types.ObjectId(_id) }, { $set: updateData });

      return result.matchedCount > 0
        ? await this.connection.collection('movies').findOne({
          _id: new Types.ObjectId(_id),
        })
        : null;
    } catch (e) {
      throw new HttpException(
        'Something went wrong ' + e,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteMovie(id: string): Promise<boolean | null> {
    try {
      const result: any = await this.connection
        .collection('movies')
        .deleteOne({ _id: new Types.ObjectId(id) });
      return result.deletedCount > 0;
    } catch (e) {
      throw new HttpException(
        'Something went wrong ' + e,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
