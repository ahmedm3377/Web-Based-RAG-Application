import { Router } from 'express';
import multer from "multer";
import { query_handler, summarize_handler, upload_handler } from '../controllers/docController';


// Storage option is used here to keep the original filename
const storage = multer.diskStorage({ 
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
})

const upload = multer({ storage: storage })
const router = Router();

router.post('/upload', upload.array('files'), upload_handler);

router.post('/query', query_handler);
router.get('/summarize', summarize_handler);

export default router;