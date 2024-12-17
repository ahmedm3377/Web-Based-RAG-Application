"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login_handler = exports.register_handler = void 0;
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
// Register
const register_handler = async function (req, res, next) {
    const { fullname, email, password } = req.body;
    try {
        if (!email) {
            res.status(400).json({ success: false, data: "Email is required" });
            return;
        }
        if (!password) {
            throw new Error("Password is required!");
        }
        if (!fullname) {
            throw new Error("Fullname is required!");
        }
        const userDoc = await user_1.default.findOne({ email });
        if (userDoc != null) {
            throw new Error("Email already exist!");
        }
        const new_user = await user_1.default.create(req.body);
        res.status(201).send({ success: true, data: new_user._id.toString() });
    }
    catch (error) {
        next(error);
    }
};
exports.register_handler = register_handler;
// Login
const login_handler = async function (req, res, next) {
    const { email, password } = req.body;
    try {
        if (!email) {
            res.status(400).send({ success: false, data: { access_token: "", refresh_token: "" } });
            return;
            // throw new Error("Email is required!");
        }
        if (!password) {
            res.status(400).json({ success: false, data: { access_token: "", refresh_token: "" } });
            return;
            // throw new Error("Password is required");
        }
        const userDoc = await user_1.default.findOne({ email: email });
        if (userDoc == null) {
            res.status(400).json({ success: false, data: { access_token: "", refresh_token: "" } });
            return;
            // throw new Error("Credentials are invalid!")
        }
        const passwordMatch = await (0, bcrypt_1.compare)(password, userDoc.password);
        if (!passwordMatch) {
            res.status(400).json({ success: false, data: { access_token: "", refresh_token: "" } });
            return;
            // throw new Error("Credentials are invalid!")
        }
        if (!process.env.JWT_ACCESS_KEY_SECRET_KEY || !process.env.JWT_REFRESH_KEY_SECRET_KEY) {
            res.status(400).json({ success: false, data: { access_token: "", refresh_token: "" } });
            return;
            // throw new Error("No secret is provided!")
        }
        const access_token = (0, jsonwebtoken_1.sign)({
            user_id: userDoc._id.toString(),
            email: userDoc.email,
            fullname: userDoc.fullname,
        }, process.env.JWT_ACCESS_KEY_SECRET_KEY, {
            expiresIn: process.env.JWT_ACCESS_KEY_EXPRIRATION_DATE
        });
        const refresh_token = (0, jsonwebtoken_1.sign)({
            user_id: userDoc._id.toString(),
            fullname: userDoc.fullname,
            email: userDoc.email,
        }, process.env.JWT_REFRESH_KEY_SECRET_KEY, {
            expiresIn: process.env.JWT_REFRESH_KEY_EXPRIRATION_DATE
        });
        res.status(201).send({ success: true, data: { access_token, refresh_token } });
    }
    catch (error) {
        next(error);
    }
};
exports.login_handler = login_handler;
