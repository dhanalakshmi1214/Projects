import {Router} from 'express';
import { CreateLeaveStatus, GetAllLeaveStatus,GetSignleLeaveStatus,  UpdateLeaveStatus } from '../controllers/leaveStatus';

const router = Router();

router.post("/", CreateLeaveStatus )
router.get("/all-leave", GetAllLeaveStatus )
router.get("/pending-leave", GetSignleLeaveStatus )
router.put("/:adminId/:leaveId", UpdateLeaveStatus )


export default router;