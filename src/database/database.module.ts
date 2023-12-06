import { Module } from '@nestjs/common';
import { mongoDbProvider } from './mongodb.provider';

@Module({
  providers: [...mongoDbProvider],
  exports: [...mongoDbProvider],
})
export class DatabaseModule {}
