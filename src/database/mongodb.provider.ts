import { MongoClient } from 'mongodb';
import { MONGODB_PROVIDER } from '../configs/constants';
import { Logger } from '@nestjs/common';

export const mongoDbProvider = [
  {
    provide: MONGODB_PROVIDER,
    useFactory: async () => {
      const client = new MongoClient('mongodb://localhost:27017');

      try {
        await client.connect();
        Logger.log('Connected to Mongo Database');
        return client.db('demo');
      } catch (error) {
        Logger.error(`Couldnt connect to Mysql ${error}`, 'MongoProvider');
        throw error;
      }
    },
  },
];
