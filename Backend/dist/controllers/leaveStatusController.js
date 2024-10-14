"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLeaveStatus = exports.GetSignleLeaveStatus = exports.GetAllLeaveStatus = exports.CreateLeaveStatus = void 0;
const client_1 = require("@prisma/client");
const schemas_1 = require("../schema/schemas");
const zod_1 = require("zod");
const nodemailer_1 = __importDefault(require("nodemailer"));
const prisma = new client_1.PrismaClient();
// Email sender credentials
const senderMail = "crazydhanachandran14@gmail.com";
const senderPass = "mxpvfeywcczddyfo";
// Send email function
const sendEmail = (to, subject, text) => __awaiter(void 0, void 0, void 0, function* () {
    const emailSender = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: senderMail,
            pass: senderPass,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });
    try {
        const info = yield emailSender.sendMail({
            from: senderMail,
            to: to,
            subject: subject,
            text: text,
        });
        console.log(`Email sent to ${to}`, info);
    }
    catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email");
    }
});
const CreateLeaveStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = schemas_1.UserLeaveSchema.parse(req.body);
        const { status, availableLeave, startTime, endTime, leaveReason, mailToId, userId, } = validatedData;
        // Create leave entry in the database
        const leaveStatus = yield prisma.leave.create({
            data: {
                status: status,
                availableLeave,
                startTime,
                endTime,
                leaveReason,
                mailToId,
                leaveAppliedAt: new Date(),
                approvedAt: new Date(),
                user: {
                    connect: { id: userId },
                },
            },
        });
        // Fetch user and receiver email
        const user = yield prisma.user.findUnique({
            where: { id: userId },
            select: { username: true },
        });
        const receiverMailId = yield prisma.user.findUnique({
            where: { id: parseInt(mailToId) },
            select: { email: true },
        });
        const userName = user ? user.username : "User";
        const emailIdForReceiver = receiverMailId ? receiverMailId.email : "dhanachandran14@gmail.com";
        // Mail content
        const mailContent = `Leave request email is from "${userName}". I am unable to come to the office from ${startTime} to ${endTime} for your consideration. Reason: ${leaveReason}.`;
        const subject = "Leave Request Email";
        // Create notification for admin
        const adminNotification = yield prisma.notification.create({
            data: {
                message: `New leave request from ${userName} for the period from ${startTime} to ${endTime}. Reason: ${leaveReason}.`,
                isRead: false, // Set to false, as admin hasn't read it yet
                userId: parseInt(mailToId), // Assuming mailToId corresponds to the admin's user ID
            },
        });
        // Send email notification to the admin
        yield sendEmail(emailIdForReceiver, subject, mailContent);
        console.log(`Email sent to ${emailIdForReceiver} with subject "${subject}" and content: ${mailContent}`);
        res
            .status(201)
            .json({ message: "Leave request submitted successfully", leaveStatus });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res
                .status(400)
                .json({ message: "Validation failed", errors: error.errors });
        }
        console.error("Error creating leave status:", error);
        res.status(500).json({ message: "Error creating leave status", error });
    }
});
exports.CreateLeaveStatus = CreateLeaveStatus;
const GetAllLeaveStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.leave.findMany();
        console.log(users, "................users");
        res.status(201).json({
            Message: "All the leaves taken were listed",
            users,
        });
        console.log("All the leaves taken were listed", users);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res
                .status(400)
                .json({ message: "Validation failed", errors: error.errors });
        }
        console.error("Error getting all leaves", error);
        res.status(500).json({ error: "Error getting leaves" });
    }
});
exports.GetAllLeaveStatus = GetAllLeaveStatus;
// Get single leave status
const GetSignleLeaveStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const leaveStatusId = req.params.leaveId;
        const leaveForUser = yield prisma.leave.findUnique({
            where: { id: leaveStatusId },
        });
        console.log(leaveForUser, "................leaveForUser");
        res.status(201).json({
            Message: "All the leaves taken by the user",
            leaveForUser,
        });
        console.log("All the leaves taken by the user", leaveForUser);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res
                .status(400)
                .json({ message: "Validation failed", errors: error.errors });
        }
        console.error("Error getting all leaves", error);
        res.status(500).json({ error: "Error getting leaves" });
    }
});
exports.GetSignleLeaveStatus = GetSignleLeaveStatus;
// Update leave status function
const UpdateLeaveStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminId, leaveId } = req.params;
        const { status, availableLeave, userId } = req.body;
        // Check if the user is an admin
        const approvedByAdmin = yield prisma.user.findUnique({
            where: { id: parseInt(adminId) },
        });
        console.log(adminId, "addimhjkhdaskjhkf");
        if (!approvedByAdmin || approvedByAdmin.role !== client_1.Role.ADMIN) {
            return res
                .status(403)
                .json({ message: "Only Admins can approve the leave" });
        }
        // Update the leave status
        const updatedLeaveStatus = yield prisma.leave.update({
            where: { id: parseInt(leaveId) },
            data: {
                status: status,
                availableLeave,
                mailToId: adminId,
                userId
            },
        });
        // Fetch user email for notification
        const user = yield prisma.user.findUnique({
            where: { id: userId },
            select: { email: true },
        });
        if (user === null || user === void 0 ? void 0 : user.email) {
            const subject = `Leave Status Update: ${status}`;
            const mailContent = `Your leave status has been updated to "${status}".`;
            yield sendEmail(user.email, subject, mailContent);
            console.log(`Notification email sent to ${user.email}`);
        }
        res.status(200).json({
            message: `Leave status updated successfully for user ID: ${userId}`,
            updatedLeaveStatus,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res
                .status(400)
                .json({ message: "Validation failed", errors: error.errors });
        }
        console.error("Error updating leave status details:", error);
        res.status(500).json({ error: "Error updating leave status details" });
    }
});
exports.UpdateLeaveStatus = UpdateLeaveStatus;
