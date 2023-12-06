// movies.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [MoviesService],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should throw HttpException with status 404 when movie is not found', async () => {
    // Exclude 'fetchMovieFromDatabase' from spying
    const spy = jest
      .spyOn(service as any, 'fetchMovieFromDatabase')
      .mockResolvedValueOnce(null);

    await expect(
      service.get_movies({ query: 'nonexistentMovie' }),
    ).rejects.toThrowError(
      new HttpException('Movie not found', HttpStatus.NOT_FOUND),
    );

    // Clear the spy
    spy.mockRestore();
  });

  // Add more integration tests for other endpoints in MoviesController
});
