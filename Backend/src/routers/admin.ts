import {Router} from 'express';
import {GetAdminNotifications} from "../controllers/admin"

const router = Router();

router.get("/:adminId", GetAdminNotifications)

export default router;