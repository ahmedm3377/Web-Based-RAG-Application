"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.query_pdf = exports.save_pdf_chroma = void 0;
const pdf_1 = require("@langchain/community/document_loaders/fs/pdf");
const chroma_1 = require("@langchain/community/vectorstores/chroma");
const ollama_1 = require("@langchain/ollama");
const text_splitter_1 = require("langchain/text_splitter");
const hub_1 = require("langchain/hub");
// Create embedding & vector store instances
const embeddings = new ollama_1.OllamaEmbeddings({ model: "llama3.2" });
const vectorStore = new chroma_1.Chroma(embeddings, { collectionName: "pdf-docs" });
const llm = new ollama_1.Ollama({ model: "llama3.2" });
// Split the pdf content into chunks and save it to Chroma 
const save_pdf_chroma = async (file, user_id) => {
    try {
        // Parse the document
        const loader = new pdf_1.PDFLoader(file.path, { splitPages: false });
        const docs = await loader.load();
        // Split the document into chunks
        const textSplitter = new text_splitter_1.RecursiveCharacterTextSplitter({
            chunkSize: 500,
            chunkOverlap: 100,
        });
        const splits = await textSplitter.splitDocuments(docs);
        // Add the user_id to the metadata for retrieving purposes
        const chunks = splits.map(split => {
            console.log(split.metadata);
            return { pageContent: split.pageContent, metadata: Object.assign(Object.assign({}, split.metadata), { user_id: "3" }) };
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
        const filter = { user_id };
        // if(files.length != 0){
        //     filter.source = 
        // }
        // Retrieve the relevant documents
        const retriever = vectorStore.asRetriever({ filter });
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
