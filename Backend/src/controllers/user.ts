  import express, { Request, Response } from "express";
  import { PrismaClient, Role } from "@prisma/client";
  import argon2 from "argon2";
  import { CreateUserSchema } from "../schema/schemas";
  import { z } from "zod";

  const prisma = new PrismaClient();

  export const CreateUser = async (req: Request, res: Response) => {
    try {
      const validatedData = CreateUserSchema.parse(req.body);

      const { username, employeeId, password, email, role, joinedDate, experience } = validatedData;

      // const saltRounds = 10;
      const hashedPassword = await argon2.hash(password);
      console.log(hashedPassword);

      const newUser = await prisma.user.create({
        data: {
          username,
          employeeId,
          email,
          password: hashedPassword,
          role: role as Role,
          joinedDate,
          isActive:true,
          experience
        },
      });
      console.log(newUser);
      res.status(201).json({ message: "New user Created", newUser });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Validation failed", errors: error.errors });
      }
      console.error("Error creating a user", error);
      res.status(500).json({ message: "Error creating a user", error });
    }
  };

  export const GetSingleUser = async (req: Request<{ userId: string }>, res: Response) => {
    try {
      const {userId} = req.params;
      const singleUser = await prisma.user.findUnique({
        where:{id :parseInt(userId)}
      });
      //const validateUers = users.map((user) => CreateUserSchema.parse(user));

      res.status(201).json({ Message: "User details has been fetched", singleUser });
      console.log("User details has been fetched", singleUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Validation failed", errors: error.errors });
      }
      console.error("Error getting a user", error);
      res.status(500).json({ error: "Error getting a user" });
    }
  };

  export const UpdateUser = async (
    req: Request<{ userId: string }>,
    res: Response
  ) => {
    const { userId } = req.params;
    console.log("userid",userId)
    const { username, employeeId,email,  password, isActive, role, joinedDate,experience } = req.body;
    try {
      const updateUser = await prisma.user.update({
        where: { id: parseInt(userId )},
      
        data: {
          username,
          employeeId,
          password,
          isActive,
          role: role as Role,
          joinedDate,
          experience
        },
      });

      console.log(`Updated the ${userId} with the details`, updateUser);
      res
        .status(200)
        .json({ Message: `Updated the userid:${userId} with the deatils`, updateUser });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Validation failed", errors: error.errors });
      }
      const errorMessage = (error as Error).message;
      console.error("Error updating User details", errorMessage || error);
      res.status(500).json({ error: "Error updating User details" });
    }
  };

  export const DeleteUser = async (
    req: Request<{ userId: string }>,
    res: Response
  ) => {
    const { userId } = req.params;
    console.log(`Deleting the user with userId ${userId}`);
    try {
      const deleteUser = await prisma.user.delete({
        where: { id: parseInt(userId) },
      });
      console.log(`Deleted user ${userId}`, deleteUser);
      res.status(200).json({ Message: `Deleted user ${userId}`, deleteUser });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Validation failed", errors: error.errors });
      }
      const errorMessage = (error as Error).message;
      console.error("Error deleting the user", errorMessage);
      res.status(500).json({ error: "Error deleting the user" });
    }
  };
