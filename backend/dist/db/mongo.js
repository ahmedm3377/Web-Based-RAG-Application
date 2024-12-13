"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = connect;
const mongoose_1 = __importDefault(require("mongoose"));
function connect() {
    if (process.env.DB_URL) {
        mongoose_1.default.connect(process.env.DB_URL)
            .then(_ => console.log(`connected to local DB`))
            .catch(e => console.log(`failed to connect to DB`, e));
    }
}
