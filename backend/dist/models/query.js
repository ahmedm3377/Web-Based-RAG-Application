"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const querySchema = new mongoose_1.Schema({
    created_by: {
        user_id: mongoose_1.Schema.Types.ObjectId,
        name: String,
        email: String,
    },
    document_id: { type: String, required: true },
    query_text: { type: String, required: true },
    response_text: { type: String }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('user', querySchema);
