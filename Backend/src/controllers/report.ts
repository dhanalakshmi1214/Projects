// import express, { Request, Response } from "express";
// import { ReportType, PrismaClient } from "@prisma/client";
// import { userReportSchema } from "../schema/schemas";
// import { z } from "zod";

// const prisma = new PrismaClient();

// export const CreateReportGenerator = async (req: Request, res: Response) => {
//   try {
//     const validatedData = userReportSchema.parse(req.body);
//     const { reportType, userId } = validatedData;

//     const NewReport = await prisma.report.create({
//       data: {
//         reportType: reportType as ReportType,
//         userId : userId,
//       },
//     });
//     if (ReportType.DAILY) {
//     }
//   } catch (error) {

//   }
// };
