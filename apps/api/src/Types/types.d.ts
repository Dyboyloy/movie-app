import { User } from '../Models/UserModel';

declare global {
    namespace Express {
        interface User {
            user_id: string,
            isAdmin: boolean,
        }

        interface Request {
            user?: User;
        }
    }
}