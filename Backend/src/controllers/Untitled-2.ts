// // import express, { Request, Response } from "express";
// // import { PrismaClient, Role, LeaveStatus } from "@prisma/client";
// // import { UserLeaveSchema } from "../schema/schemas";
// // import { z } from "zod";
// // import nodemailer from "nodemailer";

// // const prisma = new PrismaClient();

// // // Configure Nodemailer for sending emails
// // const transporter = nodemailer.createTransport({
// //   service: "gmail", // Use any email service provider
// //   auth: {
// //     user: "your-email@gmail.com", // Replace with your email
// //     pass: "your-email-password", // Replace with your email password or app password
// //   },
// // });

// // // Create a new leave request
// // export const CreateLeaveStatus = async (req: Request, res: Response) => {
// //   try {
// //     const validatedData = UserLeaveSchema.parse(req.body);
// //     const { status, availableLeave, startTime, endTime, leaveReason, userId } = validatedData;

// //     const leaveStatus = await prisma.leave.create({
// //       data: {
// //         status: status as LeaveStatus,
// //         availableLeave,
// //         startTime,
// //         endTime,
// //         leaveReason,
// //         leaveAppliedAt: new Date(),
// //         approvedAt: new Date(),
// //         user: {
// //           connect: { id: userId },
// //         },
// //       },
// //     });

// //     // Fetch admin emails to notify them about the new leave request
// //     const admins = await prisma.user.findMany({
// //       where: { role: Role.ADMIN },
// //       select: { email: true },
// //     });

// //     // Send email notification to all admins
// //     for (const admin of admins) {
// //       await transporter.sendMail({
// //         from: "your-email@gmail.com", // Replace with your email
// //         to: admin.email,
// //         subject: "New Leave Request",
// //         text: `A new leave request has been submitted by user ID: ${userId}. Please review and take action.`,
// //       });
// //     }

// //     console.log("Leave status created and email sent to admins.", leaveStatus);
// //     res.status(201).json({ message: "Leave status created.", leaveStatus });
// //   } catch (error) {
// //     if (error instanceof z.ZodError) {
// //       return res.status(400).json({ message: "Validation failed", errors: error.errors });
// //     }
// //     console.error("Error creating LeaveStatus", error);
// //     res.status(500).json({ message: "Error creating LeaveStatus", error });
// //   }
// // };

// // // Update leave request and notify user
// // export const UpdateLeaveStatus = async (req: Request<{ adminId: string; leaveId: string }>, res: Response) => {
// //   try {
// //     const adminId = req.params.adminId;
// //     const leaveStatusId = req.params.leaveId;
// //     console.log("leaveid", leaveStatusId);
// //     const { status, availableLeave, startTime, endTime, leaveReason, userId } = req.body;

// //     // Check if the admin making the update is valid
// //     const approvedByAdmin = await prisma.user.findUnique({
// //       where: { id: parseInt(adminId) },
// //     });

// //     if (!approvedByAdmin || approvedByAdmin.role !== Role.ADMIN) {
// //       return res.status(403).json({ message: "Only admins can approve/reject the leave" });
// //     }

// //     // Update the leave status
// //     const updatedLeaveStatus = await prisma.leave.update({
// //       where: { id: parseInt(leaveStatusId) },
// //       data: {
// //         status: status as LeaveStatus,
// //         availableLeave,
// //         startTime,
// //         endTime,
// //         leaveReason,
// //         approvedBy: parseInt(adminId),
// //         approvedAt: new Date(),
// //       },
// //     });

// //     // Fetch the user's email to notify them about the decision
// //     const user = await prisma.user.findUnique({
// //       where: { id: userId },
// //       select: { email: true },
// //     });

// //     if (user?.email) {
// //       // Send email notification to the user
// //       const mailOptions = {
// //         from: "your-email@gmail.com", // Replace with your email
// //         to: user.email,
// //         subject: `Leave Request ${status === "APPROVED" ? "Approved" : "Rejected"}`,
// //         text: `Your leave request from ${startTime} to ${endTime} has been ${status}. Reason: ${leaveReason}`,
// //       };
// //       await transporter.sendMail(mailOptions);
// //       console.log("Email sent to user about leave approval/rejection.", updatedLeaveStatus);
// //     }

// //     res.status(200).json({
// //       message: `Leave status updated for user ${userId}`,
// //       updatedLeaveStatus,
// //     });
// //   } catch (error) {
// //     if (error instanceof z.ZodError) {
// //       return res.status(400).json({ message: "Validation failed", errors: error.errors });
// //     }
// //     console.error("Error updating leave status details", error);
// //     res.status(500).json({ error: "Error updating leave status details" });
// //   }
// // };
// import express, { Request, Response } from "express";
// import { PrismaClient, Role, LeaveStatus } from "@prisma/client";
// import { UserLeaveSchema } from "../schema/schemas";
// import { z } from "zod";
// import nodemailer from "nodemailer";

// // Prisma client
// const prisma = new PrismaClient();

// // Configure nodemailer with environment variables
// const emailSender = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER, // use your email here
//     pass: process.env.EMAIL_PASS, // use your email password here
//   },
// });

// // Helper function to send emails
// const sendEmail = async (to: string, subject: string, text: string) => {
//   try {
//     await emailSender.sendMail({
//       from: process.env.EMAIL_USER, // your email
//       to,
//       subject,
//       text,
//     });
//     console.log(`Email sent to ${to}`);
//   } catch (error) {
//     console.error("Error sending email:", error);
//     throw new Error("Failed to send email");
//   }
// };

// // Function to notify admins about leave request
// const notifyAdmins = async (userId: number) => {
//   const admins = await prisma.user.findMany({
//     where: { role: Role.ADMIN },
//     select: { email: true },
//   });

//   for (const admin of admins) {
//     if (admin.email) {
//       await sendEmail(
//         admin.email,
//         "New Leave Request",
//         `A new leave request has been submitted by user ID: ${userId}`
//       );
//     }
//   }
// };

// // Create Leave Status
// export const CreateLeaveStatus = async (req: Request, res: Response) => {
//   try {
//     const validatedData = UserLeaveSchema.parse(req.body);
//     const { status, availableLeave, startTime, endTime, leaveReason, userId } = validatedData;

//     const leaveStatus = await prisma.leave.create({
//       data: {
//         status: status as LeaveStatus,
//         availableLeave,
//         startTime,
//         endTime,
//         leaveReason,
//         leaveAppliedAt: new Date(),
//         approvedAt: new Date(),
//         user: {
//           connect: { id: userId },
//         },
//       },
//     });

//     // Notify admins about the leave request
//     await notifyAdmins(userId);

//     res.status(201).json({ message: "Leave request submitted successfully", leaveStatus });
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return res.status(400).json({ message: "Validation failed", errors: error.errors });
//     }
//     console.error("Error creating leave status:", error);
//     res.status(500).json({ message: "Error creating leave status", error });
//   }
// };

// // Update Leave Status and Notify User
// export const UpdateLeaveStatus = async (
//   req: Request<{ adminId: string; leaveId: string }>,
//   res: Response
// ) => {
//   try {
//     const { adminId, leaveId } = req.params;
//     const { status, availableLeave, startTime, endTime, leaveReason, userId } = req.body;

//     // Check if the user is an admin
//     const approvedByAdmin = await prisma.user.findUnique({
//       where: { id: parseInt(adminId) },
//     });
//     if (!approvedByAdmin || approvedByAdmin.role !== Role.ADMIN) {
//       return res.status(403).json({ message: "Only Admins can approve the leave" });
//     }

//     // Update the leave status
//     const updatedLeaveStatus = await prisma.leave.update({
//       where: { id: parseInt(leaveId) },
//       data: {
//         status: status as LeaveStatus,
//         availableLeave,
//         startTime,
//         endTime,
//         leaveReason,
//         approvedBy: parseInt(adminId),
//       },
//     });

//     // Fetch user email for notification
//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//       select: { email: true },
//     });

//     // Send email notification to the user
//     if (user?.email) {
//       const mailContent = `Your leave request from ${startTime} to ${endTime} has been ${status}. Reason: ${leaveReason}`;
//       await sendEmail(user.email, `Leave Request ${status === "APPROVED" ? "Approved" : "Rejected"}`, mailContent);
//     }

//     res.status(200).json({
//       message: `Leave status updated successfully for user ID: ${userId}`,
//       updatedLeaveStatus,
//     });
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return res.status(400).json({ message: "Validation failed", errors: error.errors });
//     }
//     console.error("Error updating leave status details:", error);
//     res.status(500).json({ error: "Error updating leave status details" });
//   }
// };
