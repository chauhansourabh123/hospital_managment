import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
import dotenv from 'dotenv';
dotenv.config();

const app = express();

const allowedOrigins = [process.env.FRONTEND_URL, process.env.DASHBOARD_URL]

app.use(
  cors({
    origin: allowedOrigins, // Specify which origins are allowed to access the server
    methods: ["GET", "POST", "DELETE", "PUT"], // Specify which HTTP methods are allowed
    credentials: true, // Allow credentials (like cookies or HTTP authentication)
  })
);

app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'))


import messageRouter from "./src/routes/message.route.js"
import userRouter from "./src/routes/user.route.js"
import appointmentRouter from "./src/routes/appointment.route.js";

app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter)
app.use("/api/v1/appointment", appointmentRouter)

export default app;