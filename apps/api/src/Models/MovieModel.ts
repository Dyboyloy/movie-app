import mongoose, { Schema, Document, model } from "mongoose";
import { v4 as uuid } from "uuid";

// define the movie interface
interface IMovie extends Document {
    movie_id: string;
    title: string;
    released_date: Date;
    description: string;
    poster_path?: string;
    averageRating: number;
    totalRatings: number;
    ratingsCount: number;
};

// Define the movie schema
const movieSchema: Schema<IMovie> = new Schema({
    movie_id: {
        type: String,
        default: uuid,
        unique: true
    },
    title: {
        type: String,
    },
    released_date: {
        type: Date,
    },
    description: {
        type: String,
    },
    poster_path: {
        type: String,
        default: ''
    },
    averageRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    ratingsCount: { type: Number, default: 0 },
});

movieSchema.index({ name: 1 })

const movieModel = model<IMovie>('Movie', movieSchema);
export default movieModel;