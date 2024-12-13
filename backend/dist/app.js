"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const users_1 = __importDefault(require("./routes/users"));
const mongo_1 = require("./db/mongo");
const app = (0, express_1.default)();
(0, mongo_1.connect)();
app.use(express_1.default.json());
app.use('/users', users_1.default);
app.listen(process.env.PORT, () => {
    console.log(`Server is listening at http://localhost:${process.env.PORT}`);
});
