import { Router } from 'express';
import { chat_history, login_handler, register_handler } from '../controllers/userController';
import { is_authenticated } from '../utils/auth';


const router = Router();

router.post('/register', register_handler);
router.post('/login', login_handler);
router.get('/chat_history', is_authenticated, chat_history);

export default router;