import mongoose from 'mongoose';

export interface IMovie extends mongoose.Document {
  title: string;
  genre_ids: string[];
  rating: number;
  link: string;
}
