import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OllamaEmbeddings } from "@langchain/ollama";
import { RequestHandler } from "express";
import documentModel from '../models/document';
import { save_pdf_chroma } from "./helpers/docHelper";

// Upload handler to uploading documents, save them to MongoDB and Chroma 
export const upload_handler: RequestHandler = async function(req, res, next){
  try{
    if(!req.files){
      res.send({ success: false, data: 'No Files are attached!'})
      return
    }
    
    const files = req.files as Express.Multer.File[];
    files.forEach( async (file) => {
      // Save the metadata to MongoDB
      const document = {
        uploaded_by: req.user,
        file_name: file.originalname,
        file_path: file.path, 
      };

      await documentModel.create(document)

      // Save the document data in Chroma in chunks
      switch(file.mimetype){
        case 'application/pdf':
          if(!req.user) throw new Error('Forbidden')
          await save_pdf_chroma(file.mimetype, file, req.user.user_id)
      }
      
    })
  }catch(err){
    next(err)
  }
}