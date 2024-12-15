import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";

// TO DO LATER
// export const upload: RequestHandler<unknown, StandardResponse<string>, User, unknown> = async function(req, res, next){
 

// I will start with retriving the relevant documents from Chroma
// Split the documents into chunks
const run_pipeline = async (pdfPath: string, prompt: string) => {

  // Parse the document
  const loader = new PDFLoader(pdfPath, {
    splitPages: false,
  });
  const docs = await loader.load();

  // Split the document into chunks
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  })
  const splits = await textSplitter.splitDocuments(docs)
  
  // Pick the vector store and the embedding
  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-large"
  })
  const vectorStore = new Chroma(embeddings, {
    collectionName: "pdf-docs"
  })
  
  // Create a retriever
  const retriever = vectorStore.asRetriever();
  // Retrieve the most similar text
  const retrievedDocuments = await retriever.invoke(prompt);
  retrievedDocuments[0].pageContent;
} 

run_pipeline('/home/souben/Downloads/RenderCV_EngineeringResumes_Theme.pdf', 'Extract the technical skills in my resume')
.then(res => console.log(res))






