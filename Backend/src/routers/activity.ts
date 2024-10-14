import {Router} from 'express';
import {GettingSingleAttendance, AllUserActivity ,Filters, updateActivity} from '../controllers/activity';

const router = Router();

router.get("/single-user/:userId", GettingSingleAttendance )
router.get("/", AllUserActivity)
router.get("/filter" ,Filters )

export default router;