"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login_handler = exports.register_handler = void 0;
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
// Register
const register_handler = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(req.body);
        const { fullname, email, password } = req.body;
        try {
            if (!email) {
                throw new Error("Email is required!");
            }
            if (!password) {
                throw new Error("Password is required");
            }
            if (!fullname) {
                throw new Error("Fullname is required");
            }
            const userDoc = yield user_1.default.findOne({ email });
            if (userDoc != null) {
                throw new Error("Email already exist");
            }
            const new_user = yield user_1.default.create(req.body);
            res.status(201).send({ success: true, data: new_user._id.toString() });
        }
        catch (error) {
            next(error);
        }
    });
};
exports.register_handler = register_handler;
// Login
const login_handler = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        try {
            if (!email) {
                throw new Error("Email is required!");
            }
            if (!password) {
                throw new Error("Password is required");
            }
            const userDoc = yield user_1.default.findOne({ email: email });
            if (userDoc == null) {
                throw new Error("Credentials are invalid!");
            }
            const passwordMatch = yield (0, bcrypt_1.compare)(password, userDoc.password);
            if (!passwordMatch) {
                throw new Error("Credentials are invalid!");
            }
            if (!process.env.JWT_ACCESS_KEY_SECRET_KEY || !process.env.JWT_REFRESH_KEY_SECRET_KEY) {
                throw new Error("No secret is provided!");
            }
            const access_token = (0, jsonwebtoken_1.sign)({
                user_id: userDoc._id,
                fullname: userDoc.fullname,
                email: userDoc.email,
            }, process.env.JWT_ACCESS_KEY_SECRET_KEY, {
                expiresIn: process.env.JWT_ACCESS_KEY_EXPRIRATION_DATE
            });
            const refresh_token = (0, jsonwebtoken_1.sign)({
                user_id: userDoc._id,
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
    });
};
exports.login_handler = login_handler;
