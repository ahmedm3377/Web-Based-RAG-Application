import { InferSchemaType, model, Schema } from "mongoose";

const historySchema = new Schema(
    {
        created_by: { 
            user_id: Schema.Types.ObjectId,
            name: String,
            email: String,
        },
        documents: [
            { type: String }
        ],
        messages: [
            { role: { type: String }, content: { type: String } }
        ]
    },
    { timestamps: true}
)

export type history = InferSchemaType<typeof historySchema>;
export default model<history>('history', historySchema);
