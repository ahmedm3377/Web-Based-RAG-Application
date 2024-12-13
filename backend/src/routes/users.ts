import { Router } from 'express';
import { login_handler, register_handler } from '../controllers/authController';


const router = Router();

router.post('/register', register_handler);
router.post('/login', login_handler);

export default router;