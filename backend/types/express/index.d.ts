declare namespace Express {
    interface Request {
        user?: {
            user_id: string,
            email: string,
            fullname: string;
        };
    }
}