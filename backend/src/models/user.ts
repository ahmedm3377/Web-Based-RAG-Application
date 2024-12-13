import { Schema, InferSchemaType, model} from "mongoose";
import { genSalt, hash } from 'bcrypt';

const userSchema = new Schema({
    fullname: { type: String, required: true},
    email: { type: String, required: true , unique: true},
    password: { type: String, required: true}
})

export type User = InferSchemaType<typeof userSchema>;

// Hash the password prior to saving in the database
userSchema.pre('save', async function (next){
    const user = this as User;
    const salt = await genSalt(10);
    user.password = await hash(user.password, salt);
    next();
})

export default model<User>('user', userSchema); 