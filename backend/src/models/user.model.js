import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minLength: 4
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    }, 
    // isOnline: {
    //     type: Boolean,
    //     default: false
    // },
    // lastSeen: {
    //     type: Date,
    //     default: new Date()
    // },
    profilePic: {
        url: {
            type: String,
            default: '' 
        },
        publicId: {
            type: String,
            default: ''
        }
    },
    bio: {
        type: String,
        default: '',
        maxLength: 200
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;