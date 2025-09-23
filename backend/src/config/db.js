import mongoose from 'mongoose';

export async function connectDB() {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Mongodb is connected: ${conn.connection.host}`);
    } catch(error) {
        console.log('Error connecting with mongodb.', error);
    }
}