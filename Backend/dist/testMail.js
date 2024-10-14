"use strict";
// const nodemailer = require("nodemailer");
// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false, // true for port 465, false for other ports
//   auth: {
//     user: "crazydhanachandran14@gmail.com",
//     pass: "mxpvfeywcczddyfo",
//   },
// });
// // async..await is not allowed in global scope, must use a wrapper
// async function main() {
//   // send mail with defined transport object
//   const info = await transporter.sendMail({
//     from: 'crazydhanachandran14@gmail.com', // sender address
//     to: "dhanachandran14@gmail.com", // list of receivers
//     subject: "Hello ✔", // Subject line
//     text: "Hello world?", // plain text body
//     html: "<b>Hello world?</b>", // html body
//   });
//   console.log("Message sent: %s", info.messageId);
//   // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
// }
// main().catch(console.error);
// import express, { Request, Response } from "express";
// import { PrismaClient, Role, LeaveStatus } from "@prisma/client";
// import { UserLeaveSchema } from "../schema/schemas";
// import { z } from "zod";
// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// // Load environment variables from .env file
// dotenv.config();
// const prisma = new PrismaClient();
// const sendEmail = async (from: string, pass: string, to: string, subject: string, text: string) => {
//   const emailSender = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false,
//     auth: {
//       user: from,
//       pass: pass,
//     },
//     tls: {
//       rejectUnauthorized: false,
//     },
//   });
//   try {
//     const info = await emailSender.sendMail({
//       from: from,
//       to: to,
//       subject: subject,
//       text: text,
//     });
//     console.log(`Email sent to ${to}`, info);
//   } catch (error) {
//     console.error("Error sending email:", error);
//     throw new Error("Failed to send email");
//   }
// };
// // Update the CreateLeaveStatus function
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
//     // Fetch user credentials (email and password) from the database
//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//       select: { email: true }, // We usually don't select the password for security reasons
//     });
//       // Send email notification to the user
//           // Send email notification to the user
//           const mailContent = `Your leave request from ${startTime} to ${endTime} has been submitted. Reason: ${leaveReason}`;
//           await sendEmail(process.env.EMAIL_SENDER || '', process.env.EMAIL_PASSWORD || '', user.email, "Leave Request Submitted", mailContent);
//           console.log(user.email, "email")
// // Other functions (GetAllLeaveStatus, GetSingleLeaveStatus, UpdateLeaveStatus) remain the same...
