import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OllamaEmbeddings } from "@langchain/ollama";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// Split the pdf content into chunks and save it to Chroma 
export const save_pdf_chroma = async (mimetype: string, file: Express.Multer.File, user_id: string) => {

  // Parse the document
  const loader = new PDFLoader(file.path, { splitPages: false });
  const docs = await loader.load();
  
  // Split the document into chunks
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  })
  
  const splits = await textSplitter.splitDocuments(docs)
  // Add the user_id to the metadata for retrieving purposes
  const chunks = splits.map(split => {
    return { pageContent: split.pageContent, metadata: {...split.metadata, user_id } }
  })

  // Create embedding & vector store instances
  const embeddings = new OllamaEmbeddings({ model: "llama3.2" });
  const vectorStore = new Chroma(embeddings, { collectionName: "pdf-docs" })
  // Add the documents to Chroma
  await vectorStore.addDocuments(chunks)
} 




