import { Module, Global } from '@nestjs/common';
import * as cacheManager from 'cache-manager';

@Global()
@Module({
  providers: [
    {
      provide: 'CACHE_MANAGER',
      useFactory: () =>
        cacheManager.caching('memory', {
          max: 100,
          ttl: 10 * 1000 /*milliseconds*/,
        }),
    },
  ],
  exports: ['CACHE_MANAGER'],
})
export class CacheModule {}
