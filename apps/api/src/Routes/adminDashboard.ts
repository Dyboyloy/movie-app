import express from 'express';
import { authMiddleware } from '../Middlewares/authMiddleware';
import { isAdminMiddleware } from '../Middlewares/adminMiddleware';

const router = express.Router();

router.get('/users', authMiddleware, isAdminMiddleware)

export default router;