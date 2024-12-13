import { Schema, InferSchemaType, model} from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    name: { type: String, required: true},
    email: { type: String, required: true , unique: true},
    password: { type: String, required: true}
})

export type User = InferSchemaType<typeof userSchema>;

// Hash the password prior to saving in the database
userSchema.pre('save', async function (next){
    const user = this as User;
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
})

export default model<User>('user', userSchema); 