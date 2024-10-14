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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Filters = exports.AllUserActivity = exports.updateActivity = exports.GettingSingleAttendance = exports.CreateUserActivity = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const CreateUserActivity = (_a) => __awaiter(void 0, [_a], void 0, function* ({ loginTime, userId, }) {
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
        yield prisma.activity.create({
            data: {
                loginTime,
                dayOfWeek: TodayDay,
                isWeekend: IsSunday,
                attendanceStatus: "HALFDAY",
                date: TodayDate,
                isMandatoryLeave: IsSaturday,
                officialLeave: false,
                totalDays: null,
                productionHour: null,
                userId,
            },
        });
    }
    catch (error) {
        console.error("Error creating user activity", error);
        throw new Error("Error creating user activity");
    }
});
exports.CreateUserActivity = CreateUserActivity;
// giving a particular user activity
const GettingSingleAttendance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        console.log("UserId", userId);
        const SingleUserAttendance = yield prisma.activity.findMany({
            where: { userId: Number(userId) },
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
    }
    catch (error) {
        console.error("Error getting a user attendance", error);
        res.status(500).json({ Error: "Error getting a user attendance", error });
    }
});
exports.GettingSingleAttendance = GettingSingleAttendance;
// activityController.ts
const updateActivity = (_a) => __awaiter(void 0, [_a], void 0, function* ({ activityId, logoutTime, productionHour, attendanceStatus }) {
    try {
        yield prisma.activity.update({
            where: { id: activityId },
            data: {
                logoutTime,
                productionHour,
                attendanceStatus: "PRESENT",
            },
        });
    }
    catch (error) {
        console.error("Error updating activity:", error);
        throw new Error("Failed to update activity");
    }
});
exports.updateActivity = updateActivity;
// all user activity 
const AllUserActivity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const AllACtivty = yield prisma.activity.findMany();
        console.log(AllACtivty);
        res.status(200).json({
            message: "All activty for the user has been listed",
            AllACtivty,
        });
    }
    catch (error) {
        console.error("Error getting all the user attendance", error);
        res
            .status(500)
            .json({ Error: "Error getting all the user attendance", error });
    }
});
exports.AllUserActivity = AllUserActivity;
const Filters = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate: startDateString, endDate: endDateString, userId } = req.query;
        if (!startDateString || !endDateString) {
            return res.status(400).json({ message: 'Start date and end date are required' });
        }
        const startDate = new Date(startDateString);
        const endDate = new Date(endDateString);
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res.status(400).json({ message: 'Invalid date format' });
        }
        endDate.setHours(23, 59, 59, 999);
        const filters = {
            date: {
                gte: startDate,
                lte: endDate,
            },
        };
        if (userId) {
            filters.userId = Number(userId);
        }
        const activities = yield prisma.activity.findMany({
            where: filters,
        });
        res.status(200).json({
            message: 'Activities filtered by the selected date range',
            activities,
        });
    }
    catch (error) {
        console.error('Error filtering activities', error);
        res.status(500).json({ error: 'Server error, please check the connection' });
    }
});
exports.Filters = Filters;
