import { RequestHandler } from "express";
import documentModel from '../models/document';
import { query_pdf, save_pdf_chroma } from "./helpers/docHelper";
import { StandardResponse } from "../common/common";

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
          failedFiles.push(file.originalname)
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
        failedFiles.push(file.originalname)
      }
    }
    res.send({success: true, data: { processedFiles, failedFiles } })
  }catch(err){
    next(err)
  }
}



// Query handler to answer user questions based on the uploaded
export const query_handler: RequestHandler<{files: string}, StandardResponse<string>, {question: string}, unknown> = async function(req, res, next){
  try {

    if(!req.user) throw new Error("Forbidden");
    
    const files = req.params.files.split(",");
    const question = req.body.question;
      
    if(!question) throw new Error("Question is required!");


    const response = await query_pdf(req.user.user_id, question, files)
    res.send({ success: true, data: response})

  }catch(err){
    next(err)
  }
}
