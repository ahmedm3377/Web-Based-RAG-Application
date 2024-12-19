import { Router } from 'express';
import multer from "multer";
import { query_handler, summarize_handler, upload_handler } from '../controllers/docController';
import fs from 'fs';


// Storage option is used here to keep the original filename
const storage = multer.diskStorage({ 
    destination: function (req, file, cb) {
        const pth = 'uploads';
        fs.mkdirSync(pth, { recursive: true });
        cb(null, 'uploads');
        console.log(cb(null, pth));
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
})

const upload = multer({ storage: storage })
const router = Router();

router.post('/upload', upload.single('file'), upload_handler);

router.post('/query', query_handler);
router.get('/summarize', summarize_handler);

export default router;