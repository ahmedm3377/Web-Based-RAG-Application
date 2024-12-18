import { RequestHandler } from "express";
import documentModel from '../models/document';
import { query_pdf, save_pdf_chroma } from "./helpers/docHelper";
import { StandardResponse } from "../common/common";
import historyModel from '../models/history';

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
export const query_handler: RequestHandler<unknown, StandardResponse<string>, {question: string, chat_id?: string}, {files: string}> = async function(req, res, next){
  try {
    if (!req.user) throw new Error("Forbidden");

    const files = req.query.files ? req.query.files.split(",") : [];
    const question = req.body.question;
    const chat_id = req.body.chat_id || null;

    if (!question) throw new Error("Question is required!");

    // Call query_pdf to get the answer
    const answer = await query_pdf(req.user.user_id, question, chat_id, files);

    if (chat_id) {
      // Update existing chat history with the new question and answer
      await historyModel.updateOne(
        { _id: chat_id },
        {
          $push: { 
            messages: [
              { role: "human", content: question },
              { role: "assistant", content: answer },
            ],
          },
        }
      );
    } else {
      // Create a new chat history if no chat_id is provided
      await historyModel.create({
        created_by: {
          user_id: req.user.user_id,
          name: req.user.fullname,
          email: req.user.email,
        },
        documents: files,
        messages: [
          { role: "human", content: question },
          { role: "assistant", content: answer },
        ],
      });
    }

    res.send({ success: true, data: answer });
  } catch (err) {
    next(err);
  }
};
