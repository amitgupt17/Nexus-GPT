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

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
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
    console("failed to connect with DB",err);
  };
};
app.listen(PORT,()=>{
  console.log("server is running");
  connectDb();
});

