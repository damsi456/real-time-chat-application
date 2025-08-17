import express from 'express';
import dotenv from 'dotenv';

import { connectDB } from './lib/db.js';
import authRoutes from './routes/auth.route.js';  

dotenv.config();
const app = express();

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT; 
app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}.`);
    connectDB();
});