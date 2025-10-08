import express from 'express';
import { authenticateUser } from '../middlewares/authenticateUser.js';
import upload from '../config/multer.js';
import { getUsersForSidebar, getMessages, sendMessage } from '../controllers/message.controller.js';

const router = express.Router();

router.get("/users", authenticateUser, getUsersForSidebar);
router.get("/:userId", authenticateUser, getMessages);
router.post("/send/:userId", authenticateUser, upload.single('image'), sendMessage);
export default router;