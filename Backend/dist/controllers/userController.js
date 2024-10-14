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
exports.DeleteUser = exports.UpdateUser = exports.GetSingleUser = exports.CreateUser = void 0;
const client_1 = require("@prisma/client");
const argon2_1 = __importDefault(require("argon2"));
const schemas_1 = require("../schema/schemas");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
const CreateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = schemas_1.CreateUserSchema.parse(req.body);
        const { username, employeeId, password, email, role, joinedDate, experience } = validatedData;
        // const saltRounds = 10;
        const hashedPassword = yield argon2_1.default.hash(password);
        console.log(hashedPassword);
        const newUser = yield prisma.user.create({
            data: {
                username,
                employeeId,
                email,
                password: hashedPassword,
                role: role,
                joinedDate,
                isActive: true,
                experience
            },
        });
        console.log(newUser);
        res.status(201).json({ message: "New user Created", newUser });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res
                .status(400)
                .json({ message: "Validation failed", errors: error.errors });
        }
        console.error("Error creating a user", error);
        res.status(500).json({ message: "Error creating a user", error });
    }
});
exports.CreateUser = CreateUser;
const GetSingleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const singleUser = yield prisma.user.findUnique({
            where: { id: parseInt(userId) }
        });
        //const validateUers = users.map((user) => CreateUserSchema.parse(user));
        res.status(201).json({ Message: "User details has been fetched", singleUser });
        console.log("User details has been fetched", singleUser);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res
                .status(400)
                .json({ message: "Validation failed", errors: error.errors });
        }
        console.error("Error getting a user", error);
        res.status(500).json({ error: "Error getting a user" });
    }
});
exports.GetSingleUser = GetSingleUser;
const UpdateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    console.log("userid", userId);
    const { username, employeeId, email, password, isActive, role, joinedDate, experience } = req.body;
    try {
        const updateUser = yield prisma.user.update({
            where: { id: parseInt(userId) },
            data: {
                username,
                employeeId,
                password,
                isActive,
                role: role,
                joinedDate,
                experience
            },
        });
        console.log(`Updated the ${userId} with the details`, updateUser);
        res
            .status(200)
            .json({ Message: `Updated the userid:${userId} with the deatils`, updateUser });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res
                .status(400)
                .json({ message: "Validation failed", errors: error.errors });
        }
        const errorMessage = error.message;
        console.error("Error updating User details", errorMessage || error);
        res.status(500).json({ error: "Error updating User details" });
    }
});
exports.UpdateUser = UpdateUser;
const DeleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    console.log(`Deleting the user with userId ${userId}`);
    try {
        const deleteUser = yield prisma.user.delete({
            where: { id: parseInt(userId) },
        });
        console.log(`Deleted user ${userId}`, deleteUser);
        res.status(200).json({ Message: `Deleted user ${userId}`, deleteUser });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res
                .status(400)
                .json({ message: "Validation failed", errors: error.errors });
        }
        const errorMessage = error.message;
        console.error("Error deleting the user", errorMessage);
        res.status(500).json({ error: "Error deleting the user" });
    }
});
exports.DeleteUser = DeleteUser;
