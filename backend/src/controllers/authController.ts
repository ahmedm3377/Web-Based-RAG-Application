import { RequestHandler} from 'express';
import userModel, { User } from '../models/user';
import { StandardResponse } from '../common/common';
import { genSalt, hash, compare} from 'bcrypt';
import { sign } from 'jsonwebtoken';

// Register
export const register_handler: RequestHandler<unknown, StandardResponse<string>, User, unknown> = async function(req, res, next){
    console.log(req.body)
    const { fullname, email, password } = req.body;

    try{
        if (!email){
            res.status(400).json({success: false, data:"Email is required"});
            return;

        }

        if(!password){
            res.status(400).json({success: false, data:"Password is required"});
            return;

        }

        if(!fullname){
            res.status(400).json({success: false, data:"Fullname is required"});
            return;
        }

        const userDoc = await userModel.findOne({ email })
        if( userDoc != null ){
            res.status(400).json({success: false, data:"Email already exist"});
            return;
        }

        const new_user = await userModel.create(req.body);
        res.status(201).send({ success: true, data: new_user._id.toString()})

    }catch(error){
        next(error)
    }
}

// Login
export const login_handler: RequestHandler<unknown, StandardResponse<{ access_token: string, refresh_token?: string}>, User, unknown> = async function(req, res, next) {
    const { email, password } = req.body;
    try{
        if (!email){
            res.status(400).json({success: false});
            return;
            // throw new Error("Email is required!");
        }

        if(!password){
            res.status(400).json({success: false});
            return;
            // throw new Error("Password is required");
        }

        const userDoc = await userModel.findOne({email: email})
        if( userDoc == null ){
            res.status(400).json({success: false});
            return;
            // throw new Error("Credentials are invalid!")
        }

        const passwordMatch = await compare(password, userDoc.password)
        if (!passwordMatch) {
            res.status(400).json({success: false});
            return;
            // throw new Error("Credentials are invalid!")
        }

        if(!process.env.JWT_ACCESS_KEY_SECRET_KEY || !process.env.JWT_REFRESH_KEY_SECRET_KEY){
            res.status(400).json({success: false});
            return;
            // throw new Error("No secret is provided!")
        }

        const access_token  = sign(
            {
                user_id: userDoc._id,
                fullname: userDoc.fullname,
                email: userDoc.email,
            },
            process.env.JWT_ACCESS_KEY_SECRET_KEY,
            {
                expiresIn: process.env.JWT_ACCESS_KEY_EXPRIRATION_DATE
            }
        )


        const refresh_token  = sign(
            {
                user_id: userDoc._id,
                fullname: userDoc.fullname,
                email: userDoc.email,
            },
            process.env.JWT_REFRESH_KEY_SECRET_KEY,
            {
                expiresIn: process.env.JWT_REFRESH_KEY_EXPRIRATION_DATE
            }
        )

        res.status(201).send({ success: true, data: { access_token, refresh_token } })
    
    }catch(error){
        next(error)
    }
}