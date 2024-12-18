"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.query_handler = exports.upload_handler = void 0;
const document_1 = __importDefault(require("../models/document"));
const docHelper_1 = require("./helpers/docHelper");
const history_1 = __importDefault(require("../models/history"));
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
                if (doc) {
                    failedFiles.push(`${file.originalname} - File already exist!`);
                    continue;
                }
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
                failedFiles.push(`${file.originalname} - ${err.message}!`);
            }
        }
        res.send({ success: true, data: { processedFiles, failedFiles } });
    }
    catch (err) {
        next(err);
    }
};
exports.upload_handler = upload_handler;
// Query handler to answer user questions based on the uploaded
const query_handler = async function (req, res, next) {
    try {
        if (!req.user)
            throw new Error("Forbidden");
        const files = req.query.files ? req.query.files.split(",") : [];
        const question = req.body.question;
        const chat_id = req.body.chat_id || null;
        if (!question)
            throw new Error("Question is required!");
        // Call query_pdf to get the answer
        const answer = await (0, docHelper_1.query_pdf)(req.user.user_id, question, chat_id, files);
        if (chat_id) {
            // Update existing chat history with the new question and answer
            await history_1.default.updateOne({ _id: chat_id }, {
                $push: {
                    messages: [
                        { role: "human", content: question },
                        { role: "assistant", content: answer },
                    ],
                },
            });
        }
        else {
            // Create a new chat history if no chat_id is provided
            await history_1.default.create({
                created_by: {
                    user_id: req.user.user_id,
                    name: req.user.fullname,
                    email: req.user.email,
                },
                documents: files,
                messages: [
                    { role: "human", content: question },
                    { role: "assistant", content: answer },
                ],
            });
        }
        res.send({ success: true, data: answer });
    }
    catch (err) {
        next(err);
    }
};
exports.query_handler = query_handler;
