import express from 'express';
import upload from '../config/multer.js';
import { authenticateUser } from '../middlewares/authenticateUser.js';
import { deleteProfile, updateProfile } from '../controllers/profile.controller.js';

const router = express.Router();
 
router.put('/update', authenticateUser, upload.single('profilePic'), updateProfile);
router.delete('/delete', authenticateUser, deleteProfile);

export default router;