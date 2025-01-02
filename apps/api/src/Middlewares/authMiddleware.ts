import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface JwtPayload {
    user_id: string;
    isAdmin: boolean;
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.x_auth_cookie;
        if (!token) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        const decoded = jwt.verify(token, <string>process.env.JWT_SECRET) as JwtPayload;
        req.user = {
            user_id: decoded.user_id,
            isAdmin: decoded.isAdmin
        };
        next();
    } catch (error) {
        return res.status(500).json({ error: ( error as Error).message })
    }
}