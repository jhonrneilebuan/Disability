import express from "express";
import { verifyToken } from "../middlewares/token.js";
import { sendEmail, contactUs } from "../controllers/email.controller.js";

const router = express.Router();

router.post("/:id", verifyToken, sendEmail);
router.post("/contact", contactUs);


export default router;