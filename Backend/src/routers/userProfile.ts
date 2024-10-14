import {Router} from 'express';

import { CreateUser, GetSingleUser, UpdateUser,DeleteUser} from "../controllers/user";

const router = Router();



router.get("/:userId", GetSingleUser);
router.post("/", CreateUser);
router.put("/:userId", UpdateUser);
router.delete("/", DeleteUser);

// // leavestatus
// router.get("/leaveStatus", GetAllLeaveStatus);
// router.post("/leaveStatus", CreateLeaveStatus);
// router.put("/leaveStatus/:adminId/:leaveId", UpdateLeaveStatus);

// router.post("/adminAction", CreateAdmin)

// // activty 
// router.get("/activity/:userId", AllActivity )


export default router ;