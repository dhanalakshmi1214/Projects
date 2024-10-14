import {Router} from 'express';
import { UserLogin,UserLogout  } from '../controllers/auth';

const router = Router();

router.post("/login", UserLogin )
router.post("/logout", UserLogout )


export default router;