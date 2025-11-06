import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';  
import profileRoutes from './routes/profile.routes.js';
import messageRoutes from './routes/message.routes.js'; 
import { app, server } from './config/socket.js';

dotenv.config();

const PORT = process.env.PORT; 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/messages', messageRoutes);

// Start the HTTP server that has both the Express and Socket.IO
server.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}.`);
    connectDB();
}); 