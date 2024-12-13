import { Schema, InferSchemaType, model} from "mongoose";


const userSchema = new Schema({
    created_by: { 
        user_id: Schema.Types.ObjectId,
        name: String,
        email: String,
    },
    document_id: { type: String, required: true},
    query_text: { type: String, required: true},
    response_text: {type: String}
}, { timestamps: true}
)

export type User = InferSchemaType<typeof userSchema>;
export default model<User>('user', userSchema); 