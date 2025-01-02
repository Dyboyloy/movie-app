import mongoose from "mongoose";

const userRatingSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    movieId: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 10 },
});

export const UserRating = mongoose.model("UserRating", userRatingSchema);