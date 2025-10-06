import express from 'express';
import { signUp, logIn, logOut } from '../controllers/auth.controller.js';
import { authenticateUser } from '../middlewares/authenticateUser.js';
import upload from '../config/multer.js';

const router = express.Router();

router.post('/signup', upload.single('profilePic'), signUp);

router.post('/login', logIn);

router.post('/logout', authenticateUser, logOut);

// test route
// router.get('/verify-auth', authenticateUser, (req, res) => {
//     res.status(200).json({
//         userId: req.user.userId,
//         message: "Your JWT is working correctly!"
//     })
// })

export default router;