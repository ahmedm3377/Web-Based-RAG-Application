"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload_handler = void 0;
const pdf_1 = require("@langchain/community/document_loaders/fs/pdf");
const text_splitter_1 = require("langchain/text_splitter");
const chroma_1 = require("@langchain/community/vectorstores/chroma");
const ollama_1 = require("@langchain/ollama");
const document_1 = __importDefault(require("../models/document"));
// Upload handler to uploading documents, save them to MongoDB and Chroma 
const upload_handler = async function (req, res, next) {
    try {
        if (!req.files) {
            res.send({ success: false, data: 'No Files are attached!' });
            return;
        }
        const files = req.files;
        files.forEach(async (file) => {
            // Save the metadata to MongoDB
            const document = {
                uploaded_by: req.user,
                file_name: file.originalname,
                file_path: file.path,
            };
            await document_1.default.create(document);
            // Save the document data in Chroma in chunks
            switch (file.mimetype) {
                case 'application/pdf':
                    if (!req.user)
                        throw new Error('Forbidden');
                    await save_pdf_chroma(file.mimetype, file, req.user.user_id);
            }
        });
    }
    catch (err) {
        next(err);
    }
};
exports.upload_handler = upload_handler;
// Split the pdf content into chunks and save it to Chroma 
const save_pdf_chroma = async (mimetype, file, user_id) => {
    // Parse the document
    const loader = new pdf_1.PDFLoader(file.path, {
        splitPages: false,
    });
    const docs = await loader.load();
    // Split the document into chunks
    const textSplitter = new text_splitter_1.RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });
    const splits = await textSplitter.splitDocuments(docs);
    // Add the user_id to the metadata for retrieving purposes
    const chunks = splits.map(split => {
        return {
            pageContent: split.pageContent,
            metadata: Object.assign(Object.assign({}, split.metadata), { user_id })
        };
    });
    console.log(chunks);
    // Create embedding & vector store instances
    const embeddings = new ollama_1.OllamaEmbeddings({
        model: "llama3.2",
    });
    const vectorStore = new chroma_1.Chroma(embeddings, {
        collectionName: "pdf-docs"
    });
    // Add the documents to Chroma
    await vectorStore.addDocuments(chunks);
};
