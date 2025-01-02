import { Request, Response, NextFunction } from "express"

export const isAdminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.x_auth_cookie;
        if (!token) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        if (!req.user?.isAdmin) {
            return res.status(403).json({ message: 'You are not admin' });
        }
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Please authenticate.' });
    }
}