"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
router.post('/register', userController_1.register_handler);
router.post('/login', userController_1.login_handler);
//router.get('/chat_history', is_authenticated, chat_history);
exports.default = router;
