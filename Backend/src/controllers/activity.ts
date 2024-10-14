import express, { Request, Response } from "express";
import { AttendanceStatus, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const CreateUserActivity = async ({
  loginTime,
  userId,
}: {
  loginTime: Date;
  userId: number;
}) => {
  try {
    const DaysOfWeek = [
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ];
    const TodayDay = DaysOfWeek[new Date().getDay()];
    const TodayDate = new Date();
    const IsSunday = TodayDate.getDay() == 0;

    const IsSaturday = TodayDate.getDay() == 6;

    await prisma.activity.create({
      data: {
        loginTime,
        dayOfWeek: TodayDay,
        isWeekend: IsSunday,
        attendanceStatus: "HALFDAY" as AttendanceStatus,
        date: TodayDate,
        isMandatoryLeave: IsSaturday,
        officialLeave: false,
        totalDays: null,
        productionHour: null,
        userId,
      },
    });
  } catch (error) {
    console.error("Error creating user activity", error);
    throw new Error("Error creating user activity");
  }
};

// giving a particular user activity
export const GettingSingleAttendance = async (
  req: Request<{ userId: number }>,
  res: Response
) => {
  const { userId } = req.params;

  try {
    console.log("UserId",userId);
    const SingleUserAttendance = await prisma.activity.findMany({
      where: { userId: Number(userId)},
      
    });
    if (SingleUserAttendance.length === 0) {
      return res
        .status(400)
        .json({ message: "No activty for the user has been listed" });
    }
    res.status(200).json({
      message: "All activty for the user has been listed",
      SingleUserAttendance,
    });
  } catch (error) {
    console.error("Error getting a user attendance", error);
    res.status(500).json({ Error: "Error getting a user attendance", error });
  }
};
// activityController.ts
export const updateActivity = async ({ activityId, logoutTime, productionHour, attendanceStatus }: 
  { 
    activityId: number; 
    logoutTime: Date; 
    productionHour: number; 
    attendanceStatus: string; 
  }) => {
    try {
      await prisma.activity.update({
        where: { id: activityId },
        data: {
          logoutTime,
          productionHour,
          attendanceStatus:"PRESENT",
        },
      });
    } catch (error: any) {
      console.error("Error updating activity:", error);
      throw new Error("Failed to update activity");
    }
};

// all user activity 
export const AllUserActivity = async (req: Request, res: Response) => {
  try {
    const AllACtivty = await prisma.activity.findMany();

    console.log(AllACtivty);
    res.status(200).json({
      message: "All activty for the user has been listed",
      AllACtivty,
    });
  } catch (error) {
    console.error("Error getting all the user attendance", error);
    res
      .status(500)
      .json({ Error: "Error getting all the user attendance", error });
  }
};



export const Filters = async (req: Request, res: Response) => {
  try {
    const { startDate: startDateString, endDate: endDateString, userId } = req.query;

    // Validate start and end dates
    if (!startDateString || !endDateString) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    const startDate = new Date(startDateString as string);
    const endDate = new Date(endDateString as string);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    endDate.setHours(23, 59, 59, 999);

    const filters: any = {
      date: {
        gte: startDate,
        lte: endDate,
      },
    };

    // Ensure userId is a valid number and not undefined or null
    if (userId) {
      const parsedUserId = Number(userId);
      if (isNaN(parsedUserId)) {
        return res.status(400).json({ message: 'Invalid userId' });
      }
      filters.userId = parsedUserId;
    }

    const activities = await prisma.activity.findMany({
      where: filters,
    });

    res.status(200).json({
      message: 'Activities filtered by the selected date range',
      activities,
    });
  } catch (error) {
    console.error('Error filtering activities', error);
    res.status(500).json({ error: 'Server error, please check the connection' });
  }
};


