"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt_1 = require("bcrypt");
const userSchema = new mongoose_1.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    chat_history: [
        {
            question: { type: String, required: true },
            answer: { type: String },
            documents: [{ type: String }]
        }
    ]
});
// Hash the password prior to saving in the database
userSchema.pre('save', async function (next) {
    const user = this;
    const salt = await (0, bcrypt_1.genSalt)(10);
    user.password = await (0, bcrypt_1.hash)(user.password, salt);
    next();
});
exports.default = (0, mongoose_1.model)('user', userSchema);
