import express from "express";
import { authMiddleware } from "../Middlewares/authMiddleware";
import { createMovie, deleteMovie, getAllMovies, getMovieById, updateMovie } from "../Controllers/movieController";

const router = express.Router();

// Get all movie
router.get('/discover', authMiddleware, getAllMovies);

// Search a movie
router.get('/search', authMiddleware, getAllMovies);

// Get a movie detail
router.get('/detail/:movie_id', authMiddleware, getMovieById)

// Create a new movie
router.post('/create', authMiddleware, createMovie);

// Update a movie data
router.patch('/update/:movie_id', authMiddleware, updateMovie);

// Delete a movie
router.delete('/delete/:movie_id', authMiddleware, deleteMovie);

export default router;