import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { Ollama, OllamaEmbeddings } from "@langchain/ollama";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { pull } from 'langchain/hub';
import { VectorStoreRetriever } from '@langchain/core/vectorstores';
import historyModel from '../../models/history';
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";


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
export const query_pdf = async (user_id: string, question: string, chat_id: string | null, files: string[]) => {
    try {

        // Check if the question is set
        if(!question){
            throw new Error("Query PDF: Question is required!")
        }

        // Check if the user_id is set
        if(!user_id){
            throw new Error("Query PDF: User ID is required!")
        }

        // Fetch the chat history if there is one
        const history: [{ role: string, content: string }] | null = await historyModel.findOne(
            { _id: chat_id, "created_by.user_id": user_id},
            { _id: 0, messages: 1 }
        )   

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

        // Create a prompt that includes the chat history
        const contextualizedQSystemPrompt = 
            "Given a chat history and the latest user question which might reference context in the chat history," +
            "formulate a standalone question which can be understood without the chat history. Do NOT answer the question, " +
            "just reformulate it if needed and otherwise return it as is.";

        const contextualizedQPrompt = ChatPromptTemplate.fromMessages([
            ["system", contextualizedQSystemPrompt],
            new MessagesPlaceholder("chathistory"),
            ["human", "{input}"]
        ])

        // Instantiate a history aware retirever
        const historyAwareRetriever = await createHistoryAwareRetriever({
            llm,
            retriever,
            rephrasePrompt: contextualizedQPrompt
        })

        // Create the full QA chain
        const systemPrompt =
            "You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer " +
            "the question. If you don't know the answer, say that you don't know. Use three sentences maximum and keep the " +
            "answer concise. \n\n" +
            "{context}";
        
        const qaPrompt = ChatPromptTemplate.fromMessages([
            ["system", systemPrompt],
            new MessagesPlaceholder("chat_history"),
            ["human", "{input}"]
        ])

        const QAchain = await createStuffDocumentsChain({
            llm,
            prompt: qaPrompt,
        })

        const ragChain = await createRetrievalChain({
            retriever: historyAwareRetriever,
            combineDocsChain: QAchain,
        })

        let chat_history: BaseMessage[] = []
        if(history){
            chat_history = history.map(
                ({ role, content }) => {
                    if( role == "human" ) return new HumanMessage(content);
                    else return new AIMessage(content)
                }
            )
        }
        const aiMessage = await ragChain.invoke({ "input": question, "chat_history": chat_history })
        console.log(aiMessage)
        return aiMessage.answer
    }catch(err){
        throw err
    }    
}






