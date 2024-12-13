import { Schema, InferSchemaType, model} from "mongoose";


const userSchema = new Schema({
    name: { type: String, required: true},
    email: { type: String, required: true , unique: true},
    password: { type: String, required: true}
})

export type User = InferSchemaType<typeof userSchema>;
export default model<User>('user', userSchema); 