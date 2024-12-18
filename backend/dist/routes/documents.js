"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const docController_1 = require("../controllers/docController");
// Storage option is used here to keep the original filename
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage: storage });
const router = (0, express_1.Router)();
router.post('/upload', upload.array('files'), docController_1.upload_handler);
router.post('/query', docController_1.query_handler);
exports.default = router;
