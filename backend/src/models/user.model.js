import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    }, 
    fullName: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    }, 
    profilePic: {
        type: String,
        default: '' 
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;