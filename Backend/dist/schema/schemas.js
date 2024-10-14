"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSalarySchema = exports.UserLeaveSchema = exports.UserAdminActionSchema = exports.userReportSchema = exports.UserLoginSchema = exports.CreateUserSchema = void 0;
const zod_1 = require("zod");
exports.CreateUserSchema = zod_1.z.object({
    username: zod_1.z.string().min(1, "Username is required"),
    employeeId: zod_1.z.string(),
    email: zod_1.z.string(),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters long"),
    isActive: zod_1.z.boolean(),
    joinedDate: zod_1.z.string(),
    experience: zod_1.z.string(),
    adharNo: zod_1.z.string(),
    panNo: zod_1.z.string(),
    role: zod_1.z.enum(["USER", "ADMIN"]),
});
exports.UserLoginSchema = zod_1.z.object({
    employeeId: zod_1.z.string(),
    password: zod_1.z.string().min(6),
});
// export const UserActivitySchema = z.object({
//   loginTime :z.string().optional(),
//   logoutTime :z.string().optional(),
//   attendanceStatus :z.enum(["PRESENT", "ABSENT", "HALFDAY"]),
//   date: z.date(),
//   dayOfWeek : z.string(),
//   isWeekend : z.boolean(),
//   isMandatoryLeave :z.boolean(),
//   officialLeave : z.boolean(),
//   productionHour : z.number(),
//   userId : z.number() 
// })
exports.userReportSchema = zod_1.z.object({
    reportType: zod_1.z.enum(["DAILY", "WEEKLY", "MONTHLY"]),
    userId: zod_1.z.number()
});
exports.UserAdminActionSchema = zod_1.z.object({
    activityType: zod_1.z.enum(["ATTENDANCE", "USERCREATION", "REPORTGENERATION", "LEAVEAPPROVAL"]),
    //   adminId:z.number(),
    //  adminName:z.string(),
    userId: zod_1.z.number()
});
exports.UserLeaveSchema = zod_1.z.object({
    status: zod_1.z.enum(["APPROVED", "PENDING", "REJECTED"]),
    availableLeave: zod_1.z.number().max(3),
    startTime: zod_1.z.string(),
    endTime: zod_1.z.string(),
    leaveReason: zod_1.z.string(),
    mailToId: zod_1.z.string(),
    approvedBy: zod_1.z.string().optional(),
    userId: zod_1.z.number()
});
exports.UserSalarySchema = zod_1.z.object({
    baseAmount: zod_1.z.number(),
    bonus: zod_1.z.number(),
    deduction: zod_1.z.number(),
    netAmount: zod_1.z.number(),
    paymentDate: zod_1.z.number(),
    userId: zod_1.z.number()
});
