import express from "express";
import { authMiddleware } from "../Middlewares/authMiddleware";
import { addMovieToFavorite, addRate, getUserProfile, removeFromFavorite, updateUser } from "../Controllers/userController";
const router = express.Router();

// Get user profile
router.get('/profile', authMiddleware, getUserProfile);

// Add movie to favorite
router.post('/add/movie/:movie_id', authMiddleware, addMovieToFavorite);

// Remove movie from favorite
router.post('/remove/movie/:movie_id', authMiddleware, removeFromFavorite);

// Add rate to movie
router.post('/movie/:movie_id/rate', authMiddleware, addRate);

// Update user data
router.patch('/profile/update', authMiddleware, updateUser);

export default router;