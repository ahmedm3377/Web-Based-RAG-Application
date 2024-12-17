"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.is_authenticated = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const is_authenticated = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!process.env.JWT_ACCESS_KEY_SECRET_KEY)
        throw new Error('Secret is required!');
    if (!token)
        return next(new Error('Unauthorized'));
    try {
        const decoded = (0, jsonwebtoken_1.verify)(token, process.env.JWT_ACCESS_KEY_SECRET_KEY);
        req.user = decoded;
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.is_authenticated = is_authenticated;
