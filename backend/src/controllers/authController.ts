import { RequestHandler} from 'express';
import userModel, { User } from '../models/user';
import { StandardResponse } from '../common/common';
import { genSalt, hash, compare} from 'bcrypt';
import { sign } from 'jsonwebtoken';

// Register
const register_handler: RequestHandler<unknown, StandardResponse<string>, User, unknown> = async function(req, res, next){
    
    const { fullname, email, password } = req.body;

    try{
        if (!email){
            throw new Error("Email is required!");
        }

        if(!password){
            throw new Error("Password is required");
        }

        if(!fullname){
            throw new Error("Fullname is required");
        }

        const userDoc = await userModel.findOne({email: email})
        if( userDoc != null ){
            throw new Error("Email already exist")
        }

        const new_user = await userModel.create(req.body);
        res.status(201).send({ success: true, data: new_user._id.toString()})

    }catch(error){
        next(error)
    }
}

// Login
const login_handler: RequestHandler<unknown, StandardResponse<string>, User, unknown> = async function(req, res, next) {
    const { email, password } = req.body;
    try{
        if (!email){
            throw new Error("Email is required!");
        }

        if(!password){
            throw new Error("Password is required");
        }

        const userDoc = await userModel.findOne({email: email})
        if( userDoc == null ){
            throw new Error("Credentials are invalid!")
        }

        // Verify the password
        const salt = await genSalt(10);
        const hashedPassword = await hash(password, salt);
        const passwordMatch = await compare(userDoc.password, hashedPassword)
        if (!passwordMatch) {
            throw new Error("Credentials are invalid!")
        }

        if(!process.env.SECRET_KEY){
            throw new Error("No secret is provided!")
        }

        const token  = sign(
            {
                user_id: userDoc._id,
                fullname: userDoc.fullname,
                email: userDoc.email,
            },
            process.env.SECRET_KEY
        )

        res.status(201).send({ success: true, data: token })
    
    }catch(error){
        next(error)
    }
}