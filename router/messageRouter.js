import express from "express";
import {config} from "dotenv";
import {getAllMessages, sendMessage} from "../controller/messageController.js";

const router = express.Router();
router.post("/send", sendMessage); // sends message
router.get("/getall", getAllMessages); // gets all messages

export default router;   
