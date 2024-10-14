import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get notifications for admin
export const GetAdminNotifications = async (
  req: Request<{ adminId: string }>,
  res: Response
) => {
  try {
    const { adminId } = req.params;

    // Fetch notifications for the admin
    const notifications = await prisma.notification.findMany({
      where: {
        userId: parseInt(adminId),
      },
      include: {
        leave: true,
        // user: {
        //   select: { username: true },
        // },
      },
    });

    res.status(200).json({
      message: "Notifications retrieved successfully",
      notifications,
    });
  } catch (error) {
    console.error("Error retrieving notifications:", error);
    res.status(500).json({ error: "Error retrieving notifications" });
  }
};
