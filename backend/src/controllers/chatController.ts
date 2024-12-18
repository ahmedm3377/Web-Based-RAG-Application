import { RequestHandler } from "express";
import historyModel from "../models/history";
import { StandardResponse } from "../common/common";


type ChatMessage = { role: string; content: string };

// Fetch chat history based on chat_id and user_id
export const chat_history_handler: RequestHandler<{chat_id: string}, StandardResponse< string | ChatMessage[]>, unknown, unknown> = async (req, res, next) => {
    try {
        const { chat_id } = req.params;
        const user_id = req.user?.user_id;

        if (!chat_id) {
            res.status(400).json({ success: false, data: "chat_id is required!" });
            return;
        }

        // Fetch chat history from MongoDB
        const chatHistory: {messages: ChatMessage[]} | null = await historyModel.findOne(
            { _id: chat_id, "created_by.user_id": user_id },
            { _id: 0, messages: 1 } // Only return messages field
        );

        if (!chatHistory) {
            res.status(404).json({ success: false, data: "Chat history not found!" });
            return;
        }

        // Return the chat history messages
        res.status(200).json({ success: true, data: chatHistory.messages });
        return;
    } catch (err) {
        next(err);
    }
};
