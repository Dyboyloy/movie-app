import express, { type Express } from "express";
import { loginUser, registerUser } from "../Controllers/authController";

const router = express.Router();

// Register user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

export default router;