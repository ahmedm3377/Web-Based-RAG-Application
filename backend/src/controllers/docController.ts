import { RequestHandler } from "express";
import documentModel from '../models/document';
import { query_pdf, save_pdf_chroma } from "./helpers/docHelper";
import { StandardResponse } from "../common/common";
import userModel from '../models/user';

// Upload handler to uploading documents, save them to MongoDB and Chroma 
export const upload_handler: RequestHandler = async function(req, res, next){
  try {
    if(!req.files){
      res.send({ success: false, data: 'No Files are attached!'});
      return
    }

    if(!req.user) throw new Error('Forbidden');
    const files = req.files as Express.Multer.File[];
    const failedFiles: string[] = []
    const processedFiles: string[] = []

    for(const file of files){
      try {
        // Create an instance of the metadata to save in MongoDB
        const document = {
          uploaded_by: req.user,
          file_name: file.originalname,
          file_path: file.path, 
        };
        const doc = await documentModel.findOne({"file_name": file.originalname});

        if(doc){
          failedFiles.push(`${file.originalname} - File already exist!`)
          continue;
        }
        // Save the file metadata to MongoDB
        await documentModel.create(document);

        // Split the document into chunks and save them to Chroma
        switch(file.mimetype){
          case "application/pdf":
            await save_pdf_chroma(file, req.user.user_id)
            processedFiles.push(file.originalname)
            break
          default :
            failedFiles.push(file.originalname)
        }
      }catch(err){
        failedFiles.push(`${file.originalname} - ${(err as Error).message}!`)
      }
    }
    res.send({success: true, data: { processedFiles, failedFiles } })
  }catch(err){
    next(err)
  }
}



// Query handler to answer user questions based on the uploaded
export const query_handler: RequestHandler<unknown, StandardResponse<string>, {question: string}, {files: string}> = async function(req, res, next){
  try {

    if(!req.user) throw new Error("Forbidden");
    
    const files = req.query.files.split(",");
    const question = req.body.question;
      
    if(!question) throw new Error("Question is required!");

    const answer = await query_pdf(req.user.user_id, question, files)
    // Save the question and the answer to the chat history before sending the answer
    await userModel.updateOne(
      { _id: req.user.user_id }, 
      { "$push": 
        { 
          "chat_history": { question, answer, documents: files}
        } 
      }
    )

    res.send({ success: true, data: answer})
  }catch(err){
    next(err)
  }
}
