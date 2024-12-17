"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.query_handler = exports.upload_handler = void 0;
const document_1 = __importDefault(require("../models/document"));
const docHelper_1 = require("./helpers/docHelper");
// Upload handler to uploading documents, save them to MongoDB and Chroma 
const upload_handler = async function (req, res, next) {
    try {
        if (!req.files) {
            res.send({ success: false, data: 'No Files are attached!' });
            return;
        }
        if (!req.user)
            throw new Error('Forbidden');
        const files = req.files;
        const failedFiles = [];
        const processedFiles = [];
        for (const file of files) {
            try {
                // Create an instance of the metadata to save in MongoDB
                const document = {
                    uploaded_by: req.user,
                    file_name: file.originalname,
                    file_path: file.path,
                };
                const doc = await document_1.default.findOne({ "file_name": file.originalname });
                if (doc)
                    return next(new Error("Document already exist!"));
                // Save the file metadata to MongoDB
                await document_1.default.create(document);
                // Split the document into chunks and save them to Chroma
                switch (file.mimetype) {
                    case "application/pdf":
                        await (0, docHelper_1.save_pdf_chroma)(file, req.user.user_id);
                        processedFiles.push(file.originalname);
                        break;
                    default:
                        failedFiles.push(file.originalname);
                }
            }
            catch (err) {
                failedFiles.push(file.originalname);
            }
        }
        res.send({ success: true, data: { processedFiles, failedFiles } });
    }
    catch (err) {
        next(err);
    }
};
exports.upload_handler = upload_handler;
// Upload handler to uploading documents, save them to MongoDB and Chroma 
const query_handler = async function (req, res, next) {
    try {
        const files = req.params.files.split(",");
        if (!req.user)
            throw new Error("Forbidden");
    }
    catch (err) {
        next(err);
    }
};
exports.query_handler = query_handler;
