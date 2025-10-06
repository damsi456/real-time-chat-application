import express from 'express';
import { signUp, logIn, logOut, checkAuth } from '../controllers/auth.controller.js';
import { authenticateUser } from '../middlewares/authenticateUser.js';
import upload from '../config/multer.js';

const router = express.Router();

router.post('/signup', upload.single('profilePic'), signUp);

router.post('/login', logIn);

router.post('/logout', authenticateUser, logOut);

// test route
router.get('/check', authenticateUser, checkAuth);

export default router;