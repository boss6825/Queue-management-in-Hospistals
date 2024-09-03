import express, { urlencoded } from "express";
import {config} from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { dbConnection } from "./database/dbConnection.js";
import messageRouter from "./router/messageRouter.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import userRouter from "./router/userRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";



const app = express();
config({path: "./config/config.env"})

app.use(cors({
    origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
    methods:["GET", "PUT", "POST", "DELETE"],
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json()); //parse krega data ko json mei
app.use(urlencoded({extended:true}));
app.use(express.urlencoded({ extended: true }));  // br point ho sakta hai ,error remove krne ke liye lgaya tha

app.use(fileUpload({
    useTempFiles:true,
    tempFileDir: "/temp/",
}));

app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);



dbConnection();

app.use(errorMiddleware); //this error middleware should always be kept in last
export default app;