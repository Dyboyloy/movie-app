import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import movieModel from "../Models/MovieModel";

const movieSchema = z.object({
    title: z.string().min(3).max(100, "Title must be between 3 and 100 characters"),
    description: z.string().min(3).max(500),
    poster_path: z.string().default(''),
    released_date: z.string().refine((date) => {
        return !isNaN(Date.parse(date));
    }, { message: "Invalid release date format" })
});

// Get all the movies
export const getAllMovies = async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string) || 10; // default is 10,
        const skip = parseInt(req.query.skip as string) * limit || 0
        const movies = await movieModel.find().limit(limit).skip(skip);
        return res.status(200).json({ results: movies });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

// Search a movie via its title
export const searchMovieByTitle = async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string) || 10; // default is 10,
        const skip = parseInt(req.query.skip as string) * limit || 0
        const { title } = req.query;
        const movie = await movieModel.find({ name: { $regex: title, $options: 'i' } }).limit(limit).skip(skip);
        if (movie.length === 0) {
            return res.status(404).json({ message: 'Movie not found' });
        } else {
            return res.status(200).json({ results: movie });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

// Get a movie by its id
export const getMovieById = async (req: Request, res: Response) => {
    try {
        const { movie_id } = req.params;
        const movie = await movieModel.findOne({ movie_id: movie_id });
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        } else {
            return res.status(200).json({ movie });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
}

// Create movie
export const createMovie = async (req: Request, res: Response) => {
    try {
        const validatedDate = movieSchema.parse(req.body);
        const { title, description, poster_path, released_date } = validatedDate;
        const movie = new movieModel({ title, description, poster_path, released_date });
        await movie.save();
        return res.status(201).json({ message: 'Movie created successfully', movie: movie });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

// Update movie
export const updateMovie = async (req: Request, res: Response) => {
    try {
        const { movie_id } = req.params;
        const validatedDate = movieSchema.parse(req.body);
        const { title, description, poster_path, released_date } = validatedDate;
        const movie = await movieModel.updateOne({ movie_id: movie_id }, { title, description, poster_path, released_date });
        return res.status(200).json({ message: 'Movie updated successfully', movie: movie });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

// Delete movie
export const deleteMovie = async (req: Request, res: Response) => {
    try {
        const { movie_id } = req.params;
        await movieModel.deleteOne({ movie_id: movie_id });
        return res.status(200).json({ message: 'Movie deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
}