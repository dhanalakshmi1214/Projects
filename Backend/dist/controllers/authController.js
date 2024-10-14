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
exports.UserLogout = exports.UserLogin = void 0;
const client_1 = require("@prisma/client");
const argon2_1 = __importDefault(require("argon2"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const schemas_1 = require("../schema/schemas");
const activityController_1 = require("./activityController");
const prisma = new client_1.PrismaClient();
let refreshTokens = [];
const UserLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = schemas_1.UserLoginSchema.parse(req.body);
        const { employeeId, password } = validatedData;
        console.log(`Login attempted by user with Employee ID: ${employeeId}`);
        const user = yield prisma.user.findUnique({
            where: { employeeId },
        });
        if (!user) {
            console.log("Incorrect Employee ID");
            return res.status(400).json({ message: "Incorrect Employee ID" });
        }
        console.log("User Found:", user);
        const isMatch = yield argon2_1.default.verify(user.password, password);
        if (!isMatch) {
            return res.status(401).json({ error: "Incorrect password" });
        }
        const existingUser = yield prisma.activity.findFirst({
            where: {
                userId: user.id,
                logoutTime: null,
            },
        });
        if (existingUser) {
            return res.status(400).json({ message: "You are not allowed to login again" });
        }
        const accessToken = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, config_1.SECRET_KEY, { expiresIn: "5m" });
        const refreshMyToken = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, config_1.REFRESH_SECRET_KEY, { expiresIn: "7d" });
        refreshTokens.push(refreshMyToken);
        const loginTime = new Date();
        yield (0, activityController_1.CreateUserActivity)({
            loginTime,
            userId: user.id,
        });
        res.status(200).json({
            message: "Login successful",
            accessToken,
            refreshMyToken,
            employeeId,
            role: user.role,
            userId: user.id,
        });
    }
    catch (error) {
        console.error("Error during login:", error);
        if (error.name === 'ZodError') {
            return res.status(400).json({
                error: "Validation error",
                details: error.errors.map((err) => err.message),
            });
        }
        res.status(500).json({ error: "Server error, please check the connection" });
    }
});
exports.UserLogin = UserLogin;
const UserLogout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { employeeId } = req.body;
    try {
        const user = yield prisma.user.findUnique({
            where: { employeeId },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const loginRecord = yield prisma.activity.findFirst({
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
        yield (0, activityController_1.updateActivity)({
            activityId: loginRecord.id,
            logoutTime: new Date(logoutTime),
            productionHour: productivity,
            attendanceStatus: "PRESENT",
        });
        res.status(200).json({ message: "Logout successful and activity updated" });
    }
    catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ error: "Server error, please try again later" });
    }
});
exports.UserLogout = UserLogout;
