"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const documentSchema = new mongoose_1.Schema({
    uploaded_by: {
        user_id: mongoose_1.Schema.Types.ObjectId,
        name: String,
        email: String,
    },
    file_name: { type: String, required: true, unique: true },
    upload_date: { type: Date, default: new Date() }
});
exports.default = (0, mongoose_1.model)('user', documentSchema);
