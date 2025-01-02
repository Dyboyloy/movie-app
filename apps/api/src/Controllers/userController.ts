import express, { Response, Request, NextFunction } from 'express';
import userModel, { IUser } from '../Models/UserModel';
import movieModel from '../Models/MovieModel';
import { UserRating } from '../Models/UserRatingModel';

// Get a user profile
export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const user_id = req.user?.user_id;
        const user = await userModel.findOne({ user_id: user_id }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        } else {
            return res.status(200).json({ user: user });
        }
    } catch (error) {
        return res.status(500).json({ error: (error as Error).message });
    }
};

// Add movie to their favorite
export const addMovieToFavorite = async (req: Request, res: Response) => {
    try {
        const { movie_id } = req.params;
        const user_id = req.user?.user_id;

        // Find the movie
        const movie = await movieModel.findOne({ movie_id: movie_id });
        // Find the user
        const user = await userModel.findOne({ user_id: user_id }) as IUser | null;

        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        if (user?.favorite_movie?.some((fav) => fav.movie.movie_id === movie_id)) {
            return res.status(400).json({ message: 'Movie already in favorite' });
        }

        // Add movie to favorite
        user?.favorite_movie?.push({
            movie: {
                movie_id: movie.movie_id,
                title: movie.title,
                poster_path: movie.poster_path,
                rate: movie.averageRating
            }
        });
        await user?.save();
        return res.status(200).json({ message: 'Movie added to favorite', user: user });
    } catch (error) {
        return res.status(500).json({ message: 'Server Error', error: (error as Error).message });
    }
};

// Remove movie from favorite
export const removeFromFavorite = async (req: Request, res: Response) => {
    try {
        const { movie_id } = req.params;
        const user_id = req.user?.user_id;

        // Find the user via user_id
        const user = await userModel.findOne({ user_id: user_id }) as IUser | null;
        // Check if movie in user favorite
        if (!user || !user.favorite_movie?.some((movie) => movie.movie.movie_id === movie_id)) {
            return res.status(404).json({ message: 'Movie not found in favorite' });
        }

         // Remove the movie from the user's favorite_movie array
        user.favorite_movie = user.favorite_movie.filter(
            (movie) => movie.movie.movie_id !== movie_id // Exclude the movie with the matching movie_id
        );
        await user.save();
        return res.status(200).json({ message: 'Movie removed from favorite', user: user });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

// Add rate to movie
export const addRate = async (req: Request, res: Response) => {
    try {
        const { movie_id } = req.params; // Movie ID from URL
        const { rating } = req.body; // User rating (1-10)
        const user_id = req.user?.user_id; // Assuming `req.user` contains the authenticated user
    
        if (!rating || rating < 1 || rating > 10) {
            return res.status(400).json({ message: "Rating must be between 1 and 10" });
        }
    
        // Check if the movie exists
        const movie = await movieModel.findOne({ movie_id: movie_id });
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }
    
            // Check if the user has already rated this movie
            const existingRating = await UserRating.findOne({ userId: user_id, movieId: movie_id });
    
        if (existingRating) {
            // Update the existing rating
            const oldRating = existingRating.rating;
            existingRating.rating = rating;
            await existingRating.save();
    
            // Recalculate the average rating
            const totalRatingSum = movie.totalRatings - oldRating + rating;
            movie.totalRatings = totalRatingSum;
            movie.averageRating = totalRatingSum / movie.ratingsCount;
            await movie.save();
    
            return res.status(200).json({ message: "Rating updated", averageRating: movie.averageRating });
        } else {
            // Add a new rating
            const newRating = new UserRating({ userId: user_id, movieId: movie_id, rating });
            await newRating.save();
    
            // Update the movie's rating statistics
            movie.totalRatings += rating;
            movie.ratingsCount += 1;
            movie.averageRating = movie.totalRatings / movie.ratingsCount;
            await movie.save();
    
            return res.status(201).json({ message: "Rating added", averageRating: movie.averageRating });
        }
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
};

// Update user email and username
export const updateUser = async (req: Request, res: Response) => {
    try {
        const { email, username } = req.body;
        const user_id = req.user?.user_id;
        await userModel.findOneAndUpdate({ user_id: user_id }, { email, username });
        const user = await userModel.findOne({ user_id: user_id });
        return res.status(200).json({ message: "User updated", user: user });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
}