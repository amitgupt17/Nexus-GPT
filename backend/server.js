import mongoose from "mongoose";
import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";


import chatRoutes from "./routes/chat.js";
import authRoute from "./routes/AuthRoute.js"
import {googleLogin} from "./utils/GoogleAuth.js";

const app =express();
const PORT = process.env.PORT || 3000;
// server.js

// Ensure these are defined, even if env vars fail
const localOrigin = process.env.LOCAL_API_URL || "http://localhost:5173";
const prodOrigin = process.env.PROD_API_URL || "https://nexusgpt-rosy.vercel.app";

const allowedOrigins = [localOrigin, prodOrigin];

app.use(
  cors({
    origin: function (origin, callback) {
      // 1. Allow requests with no origin (like mobile apps or Postman)
      if (!origin) return callback(null, true);

      // 2. Check if the origin is in our whitelist
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // This log will appear in your Render dashboard so you can see the culprit
        console.error(`CORS Rejecting Origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/api",chatRoutes);
app.use("/", authRoute);
app.post("/google",googleLogin);
const connectDb = async() =>{
  try{
    await mongoose.connect(process.env.DBURL_API_KEY)
    console.log("db was connected");
  } catch(e){
    console.log("failed to connect with DB",e);
  };
};
app.listen(PORT,()=>{
  console.log("server is running");
  connectDb();
});

