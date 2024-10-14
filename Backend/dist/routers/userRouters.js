"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
router.get("/:userId", userController_1.GetSingleUser);
router.post("/", userController_1.CreateUser);
router.put("/:userId", userController_1.UpdateUser);
router.delete("/", userController_1.DeleteUser);
// // leavestatus
// router.get("/leaveStatus", GetAllLeaveStatus);
// router.post("/leaveStatus", CreateLeaveStatus);
// router.put("/leaveStatus/:adminId/:leaveId", UpdateLeaveStatus);
// router.post("/adminAction", CreateAdmin)
// // activty 
// router.get("/activity/:userId", AllActivity )
exports.default = router;
