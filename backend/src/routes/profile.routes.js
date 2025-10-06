import express from 'express';
import upload from '../config/multer.js';
import { authenticateUser } from '../middlewares/authenticateUser.js';
import { updateProfile } from '../controllers/profile.controller.js';

const router = express.Router();
 
router.put('/update', authenticateUser, upload.single('profilePic'), updateProfile);

export default router;