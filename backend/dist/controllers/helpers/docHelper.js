"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.query_pdf = exports.save_pdf_chroma = void 0;
const pdf_1 = require("@langchain/community/document_loaders/fs/pdf");
const chroma_1 = require("@langchain/community/vectorstores/chroma");
const ollama_1 = require("@langchain/ollama");
const text_splitter_1 = require("langchain/text_splitter");
const prompts_1 = require("@langchain/core/prompts");
const history_1 = __importDefault(require("../../models/history"));
const history_aware_retriever_1 = require("langchain/chains/history_aware_retriever");
const combine_documents_1 = require("langchain/chains/combine_documents");
const retrieval_1 = require("langchain/chains/retrieval");
const messages_1 = require("@langchain/core/messages");
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
const query_pdf = async (user_id, question, chat_id, files) => {
    try {
        // Check if the question is set
        if (!question) {
            throw new Error("Query PDF: Question is required!");
        }
        // Check if the user_id is set
        if (!user_id) {
            throw new Error("Query PDF: User ID is required!");
        }
        // Fetch the chat history if there is one
        const history = await history_1.default.findOne({ _id: chat_id, "created_by.user_id": user_id }, { _id: 0, messages: 1 });
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
        // Create a prompt that includes the chat history
        const contextualizedQSystemPrompt = "Given a chat history and the latest user question which might reference context in the chat history," +
            "formulate a standalone question which can be understood without the chat history. Do NOT answer the question, " +
            "just reformulate it if needed and otherwise return it as is.";
        const contextualizedQPrompt = prompts_1.ChatPromptTemplate.fromMessages([
            ["system", contextualizedQSystemPrompt],
            new prompts_1.MessagesPlaceholder("chathistory"),
            ["human", "{input}"]
        ]);
        // Instantiate a history aware retirever
        const historyAwareRetriever = await (0, history_aware_retriever_1.createHistoryAwareRetriever)({
            llm,
            retriever,
            rephrasePrompt: contextualizedQPrompt
        });
        // Create the full QA chain
        const systemPrompt = "You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer " +
            "the question. If you don't know the answer, say that you don't know. Use three sentences maximum and keep the " +
            "answer concise. \n\n" +
            "{context}";
        const qaPrompt = prompts_1.ChatPromptTemplate.fromMessages([
            ["system", systemPrompt],
            new prompts_1.MessagesPlaceholder("chat_history"),
            ["human", "{input}"]
        ]);
        const QAchain = await (0, combine_documents_1.createStuffDocumentsChain)({
            llm,
            prompt: qaPrompt,
        });
        const ragChain = await (0, retrieval_1.createRetrievalChain)({
            retriever: historyAwareRetriever,
            combineDocsChain: QAchain,
        });
        let chat_history = [];
        if (history) {
            chat_history = history.map(({ role, content }) => {
                if (role == "human")
                    return new messages_1.HumanMessage(content);
                else
                    return new messages_1.AIMessage(content);
            });
        }
        const aiMessage = await ragChain.invoke({ "input": question, "chat_history": chat_history });
        console.log(aiMessage);
        return aiMessage.answer;
    }
    catch (err) {
        throw err;
    }
};
exports.query_pdf = query_pdf;
