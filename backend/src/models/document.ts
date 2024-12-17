import { Schema, InferSchemaType, model} from "mongoose";


const documentSchema = new Schema({
    uploaded_by: { 
        user_id: Schema.Types.ObjectId,
        name: String,
        email: String,
    },
    file_name: { type: String, required: true , unique: true},
    file_path: { type: String, required: true, unique: true },
    upload_date: { type: Date, default: new Date() }
})

export type Document = InferSchemaType<typeof documentSchema>;
export default model<Document>('document', documentSchema); 