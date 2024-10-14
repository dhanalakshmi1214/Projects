"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const activityController_1 = require("../controllers/activityController");
const router = (0, express_1.Router)();
router.get("/:userId", activityController_1.GettingSingleAttendance);
router.get("/", activityController_1.AllUserActivity);
router.get("/filter", activityController_1.Filters);
exports.default = router;
