import express, {Application} from "express";
import cors from "cors";
import {PORT} from "./config/config"
import activityRouter from "./routers/activity"
import userRouter from "./routers/userProfile"
import authRouter from "./routers/auth"
import leaveStatusRouter from "./routers/leaveStatus"
import adminRouter from "./routers/admin"

const app:Application = express();
// app.use(cors({
//   origin: 'http://localhost:3000',
//   methods: ['GET', 'POST', 'PUT', 'DELETE','OPTIONS'],
//   allowedHeaders: ['Content-Type'],
// }));


app.use(cors());
app.use(express.json());

app.use("/user", userRouter);
app.use("/", authRouter);
app.use("/leaveStatus", leaveStatusRouter);
app.use("/activities", activityRouter);
app.use("/notification", adminRouter)



app.listen(PORT, ()=>{
    console.log(`Server is running on the port ${PORT}`)
})


export default app;
