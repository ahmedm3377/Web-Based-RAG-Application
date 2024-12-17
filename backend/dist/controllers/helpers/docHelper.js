"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.query_pdf = exports.save_pdf_chroma = void 0;
const pdf_1 = require("@langchain/community/document_loaders/fs/pdf");
const chroma_1 = require("@langchain/community/vectorstores/chroma");
const ollama_1 = require("@langchain/ollama");
const text_splitter_1 = require("langchain/text_splitter");
const hub_1 = require("langchain/hub");
// Create embedding & vector store instances
const embeddings = new ollama_1.OllamaEmbeddings({ model: process.env.LLM_MODEL });
const vectorStore = new chroma_1.Chroma(embeddings, { collectionName: process.env.CHROMA_COLLECTION });
const llm = new ollama_1.Ollama({ model: process.env.LLM_MODEL });
// Split the pdf content into chunks and save it to Chroma 
const save_pdf_chroma = async (file, user_id) => {
    try {
        // Parse the document
        const loader = new pdf_1.PDFLoader(file.path, { splitPages: true });
        const docs = await loader.load();
        // Split the document into chunks
        const textSplitter = new text_splitter_1.RecursiveCharacterTextSplitter({
            chunkSize: Number(process.env.CHUNK_SIZE),
            chunkOverlap: Number(process.env.CHUNK_OVERLAP),
        });
        const splits = await textSplitter.splitDocuments(docs);
        // Add the user_id to the metadata for retrieving purposes
        const chunks = splits.map(split => {
            return { pageContent: split.pageContent, metadata: Object.assign({ filename: file.originalname, user_id }, split.metadata) };
        });
        // Add the documents to Chroma
        const ids = await vectorStore.addDocuments(chunks);
        return ids;
    }
    catch (err) {
        throw err;
    }
};
exports.save_pdf_chroma = save_pdf_chroma;
// Retrive relevant documents and pass the results to Ollama to answer the prompt
const query_pdf = async (user_id, question, files) => {
    try {
        if (!question) {
            throw new Error("Query PDF: Question is required!");
        }
        if (!user_id) {
            throw new Error("Query PDF: User ID is required!");
        }
        // Retrieve the relevant documents
        let retriever;
        if (files && files.length == 0) {
            retriever = vectorStore.asRetriever({ filter: { user_id } });
        }
        else {
            retriever = vectorStore.asRetriever({
                filter: {
                    "$and": [
                        { user_id },
                        { "filename": { "$in": files } }
                    ]
                }
            });
        }
        const results = await retriever.invoke(question);
        // Create a context and construct a prompt that includes the question and the context
        const context = results.map(doc => doc.pageContent).join("\n");
        const template = await (0, hub_1.pull)("rlm/rag-prompt");
        const messages = await template.invoke({ question, context });
        // Invoke Ollama given the context and the prompt
        return await llm.invoke(messages);
    }
    catch (err) {
        throw err;
    }
};
exports.query_pdf = query_pdf;
