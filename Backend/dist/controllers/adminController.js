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
exports.CreateAdmin = void 0;
const client_1 = require("@prisma/client");
const schemas_1 = require("../schema/schemas");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
const CreateAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = schemas_1.UserAdminActionSchema.parse(req.body);
        const { activityType, userId } = validatedData;
        const IsAdmin = yield prisma.user.findUnique({
            where: { id: userId },
        });
        if (!IsAdmin || IsAdmin.role !== client_1.Role.ADMIN) {
            console.log("Only an ADMIN can ");
            return res.status(400).json({ Error: "", IsAdmin, });
        }
        const NewAdminAction = yield prisma.adminAction.create({
            data: {
                activityType: activityType,
                userId: userId,
            },
        });
        res
            .status(201)
            .json({ message: "Admin action created successfully", NewAdminAction });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res
                .status(400)
                .json({ message: "Validation failed", errors: error.errors });
        }
        console.error("Error creating admin action", error);
        res.status(500).json({ message: "Error creating admin action" });
    }
});
exports.CreateAdmin = CreateAdmin;
