import express, { Request, Response } from "express";
import { PrismaClient, Role, LeaveStatus } from "@prisma/client";
import { UserLeaveSchema } from "../schema/schemas";
import { z } from "zod";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

// Email sender credentials
const senderMail = "crazydhanachandran14@gmail.com";
const senderPass = "mxpvfeywcczddyfo";

// Send email function
const sendEmail = async (to: string, subject: string, text: string) => {
  const emailSender = nodemailer.createTransport({
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
    const info = await emailSender.sendMail({
      from: senderMail,
      to: to,
      subject: subject,
      text: text,
    });
    console.log(`Email sent to ${to}`, info);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

export const CreateLeaveStatus = async (req: Request, res: Response) => {
  try {
    const validatedData = UserLeaveSchema.parse(req.body);
    const {
      status,
      availableLeave,
      startTime,
      endTime,
      leaveReason,
      mailToId,
      userId,
    } = validatedData;

    // Create leave entry in the database
    const leaveStatus = await prisma.leave.create({
      data: {
        status: status as LeaveStatus,
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
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { username: true },
    });
    // const receiverMailId = await prisma.user.findUnique({
    //   where: { id: parseInt(mailToId) },
    //   select: { email: true },
    // });

    const userName = user ? user.username : "User";
    // const emailIdForReceiver = receiverMailId
    //   ? (receiverMailId.email as string)
    //   : "dhanachandran14@gmail.com";

    // Mail content
    const mailContent = `Leave request email is from "${userName}". I am unable to come to the office from ${startTime} to ${endTime} for your consideration. Reason: ${leaveReason}.`;
    const subject = "Leave Request Email";

    // // Create notification for admin
    // const adminNotification = await prisma.notification.create({
    //   data: {
    //     message: `You have received leave request from the ${userName}`,
    //     isRead: false, 
    //     leaveId: leaveStatus.id,
    //     userId: parseInt(mailToId)},
    // });

    // Send email notification to the admin
    await sendEmail(mailToId, subject, mailContent);

    console.log(
      `Email sent to ${mailToId} with subject "${subject}" and content: ${mailContent}`
    );

    res
      .status(201)
      .json({ message: "Leave request submitted successfully", leaveStatus });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.errors });
    }
    console.error("Error creating leave status:", error);
    res.status(500).json({ message: "Error creating leave status", error });
  }
};

export const GetAllLeaveStatus = async (req: Request, res: Response) => {
  try {
    const allLeaves = await prisma.leave.findMany();
    console.log(allLeaves, "................users");

    res.status(201).json({
      Message: "All the leaves taken were listed",
      allLeaves,
    });
    console.log("All the leaves taken were listed", );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.errors });
    }
    console.error("Error getting all leaves", error);
    res.status(500).json({ error: "Error getting leaves" });
  }
};

// Get single leave status
export const GetSignleLeaveStatus = async (
  req: Request,
  res: Response
) => {
  try {

    const pendingLeave = await prisma.leave.findMany({
      where: { status: "PENDING" },
    });

    console.log(pendingLeave, "................leaveForUser");

    res.status(201).json({
      Message: "All the leaves taken by the user",
      pendingLeave,
    });
    console.log("All the leaves taken by the user", pendingLeave);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.errors });
    }
    console.error("Error getting all leaves", error);
    res.status(500).json({ error: "Error getting leaves" });
  }
};

// Update leave status function
export const UpdateLeaveStatus = async (
  req: Request<{ adminId: string; leaveId: string }>,
  res: Response
) => {



  try {
    const { adminId, leaveId } = req.params;
    const { status, availableLeave, userId } = req.body;

    // Check if the user is an admin
    const approvedByAdmin = await prisma.user.findUnique({
      where: { id: parseInt(adminId) },
    });
    console.log(adminId, "addimhjkhdaskjhkf");
    if (!approvedByAdmin || approvedByAdmin.role !== Role.ADMIN) {
      return res
        .status(403)
        .json({ message: "Only Admins can approve the leave" });
    }

    // Update the leave status
    const updatedLeaveStatus = await prisma.leave.update({
      where: { id: parseInt(leaveId) },
      data: {
        status: status as LeaveStatus,
        availableLeave,
        mailToId: adminId,
        userId,
      },
    });

    // Fetch user email for notification
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (user?.email) {
      const subject = `Leave Status Update: ${status}`;
      const mailContent = `Your leave status has been updated to "${status}".`;

      await sendEmail(user.email, subject, mailContent);
      console.log(`Notification email sent to ${user.email}`);
    }
    const updatedActivity = await prisma.activity.updateMany({
      where: {
        userId: userId,
      },
      data: {
        attendanceStatus: "ABSENT",
      },
    });
    res.status(200).json({
      message: `Leave status updated successfully for user ID: ${userId}`,
      updatedLeaveStatus,
      updatedActivity
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: error.errors });
    }
    console.error("Error updating leave status details:", error);
    res.status(500).json({ error: "Error updating leave status details" });
  }
};
