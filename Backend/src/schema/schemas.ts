
import { date, z } from "zod";

export const CreateUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  employeeId :z.string(),
  email: z.string(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  isActive: z.boolean(),
  joinedDate : z.string(),
  experience : z.string(),
  adharNo : z.string(),
  panNo : z.string(),
  role: z.enum(["USER", "ADMIN"]),
});


export const UserLoginSchema = z.object({
  employeeId: z.string(),
  password: z.string().min(6),
})

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
export const userReportSchema = z.object({
  reportType : z.enum(["DAILY", "WEEKLY","MONTHLY"]),
  userId :z.number()
})

export const UserAdminActionSchema = z.object({
  activityType:z.enum(["ATTENDANCE" , "USERCREATION","REPORTGENERATION","LEAVEAPPROVAL"]),
//   adminId:z.number(),
//  adminName:z.string(),
  userId : z.number()
})
export const UserLeaveSchema = z.object({
  status :z.enum([ "APPROVED","PENDING" ,"REJECTED"]),
  availableLeave:z.number().max(3),
  startTime :z.string(),
  endTime :z.string(),
  leaveReason: z.string(),
  mailToId :z.string(),
  approvedBy : z.string().optional(),
  userId : z.number() 
})

export const UserSalarySchema =z.object({
  baseAmount :z.number(),
  bonus :z.number(),
  deduction:z.number(),
  netAmount :z.number(),
  paymentDate :z.number(),
  userId :z.number()
})