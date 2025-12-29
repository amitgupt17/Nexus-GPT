import express from "express";
import { AllThreads, Delete, SpecificMessage,Chat } from "../controllers/ChatController.js";
const router = express.Router();

router.get("/thread",AllThreads);
router.get("/thread/:threadId",SpecificMessage);
router.delete("/thread/:threadId",Delete);
router.post("/chat",Chat);

export default router;