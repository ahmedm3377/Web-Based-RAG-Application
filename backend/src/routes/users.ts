import { Router } from 'express';
import { login_handler, register_handler } from '../controllers/userController';
import { is_authenticated } from '../utils/auth';
import { chat_history_handler } from '../controllers/chatController';


const router = Router();

router.post('/register', register_handler);
router.post('/login', login_handler);
router.get('/history/:chat_id', is_authenticated, chat_history_handler);

export default router;