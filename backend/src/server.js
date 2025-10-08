import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';  
import profileRoutes from './routes/profile.routes.js';
import messageRoutes from './routes/message.routes.js'; 

dotenv.config();
const app = express();
const PORT = process.env.PORT; 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/message', messageRoutes);

app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}.`);
    connectDB();
}); 