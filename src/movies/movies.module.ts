import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { AuthGuard } from '../middlewares/auth.guard';
import { CacheModule } from '../cache.module';

@Module({
  imports: [DatabaseModule, CacheModule],
  providers: [MoviesService, AuthGuard],
  controllers: [MoviesController],
})
export class MoviesModule {}
