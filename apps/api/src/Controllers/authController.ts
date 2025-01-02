import express, { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../Models/UserModel";
import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Register a user 
const registerUserSchema = z.object({
    username: z.string().min(3).max(20, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email "),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

// Login a user schema
const loginUserSchema = z.object({
    identifier: z.string().min(3, "Email or username is required"),
    password: z.string().min(8, "Password must be at least 8 characters")
});

const createToken = (user_id: string, isAdmin: boolean) => {
    // Define the payload
    const payloads = {
        user_id,
        isAdmin
    }
    // Generate the token
    const token = jwt.sign(payloads, <string>process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
};

// Register a user
export const registerUser = async (req: Request, res: Response) => {
    const validatedData = registerUserSchema.parse(req.body);
    const { username, email, password } = validatedData;
    try {
        const existingUser = await userModel.findOne({ email }) as IUser | null;
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }
        const user = new userModel({ username, email, password });
        await user.save();

        // Create token
        const token = createToken(user.user_id.toString(), user.isAdmin);
        
        res.cookie('x_auth_cookie', token, {
            httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === 'production',
            sameSite: "strict", // Protect against CSRF attacks
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

// Login a user
export const loginUser = async (req: Request, res: Response) => {
    try {
        const validatedData = loginUserSchema.parse(req.body);
        const { identifier, password } = validatedData;
        const isEmail = /\S+@\S+\.\S+/.test(identifier);
        const user = isEmail ? await userModel.findOne({ email: identifier }) as IUser | null : await userModel.findOne({ username: identifier}) as IUser | null;
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isValidPassword = await bcrypt.compare(password, user?.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        // Create token
        const token = createToken(user.user_id.toString(), user.isAdmin);
        res.cookie('x_auth_cookie', token, {
            httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === 'production',
            sameSite: "strict", // Protect against CSRF attacks
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        res.json({ message: 'Logged in successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
}
