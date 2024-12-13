import { Schema, InferSchemaType, model} from "mongoose";


const userSchema = new Schema({
    uploaded_by: { 
        user_id: Schema.Types.ObjectId,
        name: String,
        email: String,
    },
    file_name: { type: String, required: true , unique: true},
    uploadd_date: { type: Date, default: new Date() }
})

export type User = InferSchemaType<typeof userSchema>;
export default model<User>('user', userSchema); 