"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config/config");
const activityRouters_1 = __importDefault(require("./routers/activityRouters"));
const userRouters_1 = __importDefault(require("./routers/userRouters"));
const authRouters_1 = __importDefault(require("./routers/authRouters"));
const leaveStatusRouters_1 = __importDefault(require("./routers/leaveStatusRouters"));
//import  from "./routers/adminRouters"
const app = (0, express_1.default)();
// app.use(cors({
//   origin: 'http://localhost:3000',
//   methods: ['GET', 'POST', 'PUT', 'DELETE','OPTIONS'],
//   allowedHeaders: ['Content-Type'],
// }));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/user", userRouters_1.default);
app.use("/", authRouters_1.default);
app.use("/leaveStatus", leaveStatusRouters_1.default);
app.use("/activities", activityRouters_1.default);
app.listen(config_1.PORT, () => {
    console.log(`Server is running on the port ${config_1.PORT}`);
});
exports.default = app;
