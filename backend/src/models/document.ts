import { Schema, InferSchemaType, model} from "mongoose";


const documentSchema = new Schema({
    uploaded_by: { 
        user_id: Schema.Types.ObjectId,
        name: String,
        email: String,
    },
    file_name: { type: String, required: true , unique: true},
    upload_date: { type: Date, default: new Date() }
})

export type User = InferSchemaType<typeof documentSchema>;
export default model<User>('user', documentSchema); 