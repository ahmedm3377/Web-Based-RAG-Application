import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { Ollama, OllamaEmbeddings } from "@langchain/ollama";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { pull } from 'langchain/hub';
import { VectorStoreRetriever } from '@langchain/core/vectorstores';


// Create embedding & vector store instances
const embeddings = new OllamaEmbeddings({ model: process.env.LLM_MODEL });
const vectorStore = new Chroma(embeddings, { collectionName: process.env.CHROMA_COLLECTION })
const llm = new Ollama({ model: process.env.LLM_MODEL })

// Split the pdf content into chunks and save it to Chroma 
export const save_pdf_chroma = async (file: Express.Multer.File, user_id: string) => {
    try {
        // Parse the document
        const loader = new PDFLoader(file.path, { splitPages: true });
        const docs = await loader.load();
        
        // Split the document into chunks
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: Number(process.env.CHUNK_SIZE),
            chunkOverlap: Number(process.env.CHUNK_OVERLAP),
        })
        
        const splits = await textSplitter.splitDocuments(docs)
        // Add the user_id to the metadata for retrieving purposes
        const chunks = splits.map(split => {
            return { pageContent: split.pageContent, metadata: {filename: file.originalname, user_id, ...split.metadata} }
        })

        // Add the documents to Chroma
        const ids = await vectorStore.addDocuments(chunks)
        return ids
    }catch(err){
        throw err
    }
} 

// Retrive relevant documents and pass the results to Ollama to answer the prompt
export const query_pdf = async (user_id: string, question: string, files: string[]) => {
    try {
        if(!question){
            throw new Error("Query PDF: Question is required!")
        }

        if(!user_id){
            throw new Error("Query PDF: User ID is required!")
        }
        // Retrieve the relevant documents
        let retriever!: VectorStoreRetriever<Chroma>;
        if(files && files.length == 0){
            retriever = vectorStore.asRetriever({ filter: {user_id} })
        }else{
            retriever = vectorStore.asRetriever({ 
                filter: { 
                    "$and": [
                        {user_id },
                        {"filename": {"$in": files}}
                    ] 
                }
            })
        }
        const results  = await retriever.invoke(question)

        // Create a context and construct a prompt that includes the question and the context
        const context = results.map( doc => doc.pageContent ).join("\n");
        const template = await pull<ChatPromptTemplate>("rlm/rag-prompt");
        const messages = await template.invoke({question, context})

        // Invoke Ollama given the context and the prompt
        return await llm.invoke(messages)
    }catch(err){
        throw err
    }    
}






