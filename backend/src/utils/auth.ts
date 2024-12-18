import { RequestHandler } from "express";
import { verify } from 'jsonwebtoken';
import { UserInfo } from "../common/common";

export const is_authenticated: RequestHandler = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if(!process.env.JWT_ACCESS_KEY_SECRET_KEY)
        throw new Error('Secret is required!');

    if (!token) 
        return next(new Error('Unauthorized'));

    try {
        const decoded = verify(token, process.env.JWT_ACCESS_KEY_SECRET_KEY) as UserInfo;
        req.user = decoded
        next();
    } catch (err) {
        next(err)
    }
}