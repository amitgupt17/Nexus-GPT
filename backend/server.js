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
const allowedOrigins = [
  process.env.LOCAL_API_URL,            
  process.env.PROD_API_URL   
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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
    console("failed to connect with DB",e);
  };
};
app.listen(PORT,()=>{
  console.log("server is running");
  connectDb();
});

