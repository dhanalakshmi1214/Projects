import express, { Request, Response } from "express";
import { AttendanceStatus, PrismaClient, Role } from "@prisma/client";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { SECRET_KEY, REFRESH_SECRET_KEY } from "../config/config";
import { UserLoginSchema } from "../schema/schemas";
import { CreateUserActivity , updateActivity} from "./activity";

const prisma = new PrismaClient();
let refreshTokens: string[] = [];

export const UserLogin = async (req: Request, res: Response) => {
  try {
   
    const validatedData = UserLoginSchema.parse(req.body);
    const { employeeId, password } = validatedData;

    console.log(`Login attempted by user with Employee ID: ${employeeId}`);

  
    const user = await prisma.user.findUnique({
      where: { employeeId },
    });

    if (!user) {
      console.log("Incorrect Employee ID");
      return res.status(400).json({ message: "Incorrect Employee ID" });
    }

    console.log("User Found:", user);

   
    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    
    const existingUser = await prisma.activity.findFirst({
      where: {
        userId: user.id,
        logoutTime: null,
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: "You are not allowed to login again" });
    }

    
    const accessToken = jwt.sign(
      { id: user.id, role: user.role as Role },
      SECRET_KEY,
      { expiresIn: "5m" }
    );
    const refreshMyToken = jwt.sign(
      { id: user.id, role: user.role as Role },
      REFRESH_SECRET_KEY,
      { expiresIn: "7d" }
    );
    refreshTokens.push(refreshMyToken);

    
    const loginTime = new Date();
    await CreateUserActivity({
      loginTime,
      userId: user.id,
    });

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshMyToken,
      employeeId,
      role: user.role as Role,
      userId : user.id,

    });

  } catch (error: any) {
    console.error("Error during login:", error);


    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: "Validation error",
        details: error.errors.map((err: any) => err.message),
      });
    }

    res.status(500).json({ error: "Server error, please check the connection" });
  }
};


export const UserLogout = async (req: Request, res: Response) => {
  const { employeeId } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { employeeId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const loginRecord = await prisma.activity.findFirst({
      where: {
        userId: user.id,
        logoutTime: null,
      },
      orderBy: {
        loginTime: 'desc',
      },
    });

    if (!loginRecord) {
      return res.status(400).json({ message: "User not logged in or already logged out" });
    }

    const startTime = loginRecord.loginTime.getTime();
    const logoutTime = new Date().getTime();
    const productivity = Math.floor((logoutTime - startTime) / (1000 * 60 * 60)); // Time difference in hours

    await updateActivity({
      activityId: loginRecord.id,
      logoutTime: new Date(logoutTime),
      productionHour: productivity,
      attendanceStatus: "PRESENT",
    });

    res.status(200).json({ message: "Logout successful and activity updated" });
  } catch (error: any) {
    console.error("Error during logout:", error);
    res.status(500).json({ error: "Server error, please try again later" });
  }
};

