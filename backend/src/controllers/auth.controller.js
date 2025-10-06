import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../config/cloudinary.js";
import { generateTokens } from "../utils/jwtUtil.js";

export const signUp = async (req, res) => {
    try {
        const { username, email, password, bio } = req.body;
        const profilePicFile = req.file;

        // Input validation
        if (!username || !email || !password) {
            return res.status(200).json({
                message: "All required fields should be filled."
            })
        }
        
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters."
            });
        }

        if (username.length < 4) {
            return res.status(400).json({
                message: "Username must be at least 4 characters."
            });
        }

        // Check whether user already exists
        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            if (existingUser.username == username) {
                return res.status(400).json({ message: "Username already exists" });
            } else {
                return res.status(400).json({ message: "Email already exists" });
            }
        }

        // Hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let profilePic = '';
        // Only upload image if its provided
        if (profilePicFile) {
            // Converting to base 64 as it's supported by cloudinary. (as we're using memorystroge in multer and not saving to the disk.)
            const fileBase64 = `data:${profilePicFile.mimetype};base64,${profilePicFile.buffer.toString('base64')}`;

            const uploadResponse = await cloudinary.uploader.upload(fileBase64);
            profilePic = uploadResponse.secure_url;
        }

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            bio: bio || '',
            profilePic
        })

        if (newUser) {
            await newUser.save();
            generateTokens(newUser._id, res); // cookie setting also happens here

            res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                profilePic: newUser.profilePic,
                bio: newUser.bio
            });
        } else {
            res.status(400).json({ message: "Invalid user data." })
        }

    } catch (error) {
        console.log("Error on sign up", error);
        res.status(500).json({ message: "Internal server error."});
    }
} 

export const logIn = async (req, res) => {
    try {
        const { emailOrUsername, password } = req.body;

        // Validation
        if (!emailOrUsername || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({
            $or: [
                { email: emailOrUsername.toLowerCase() },
                { username: emailOrUsername}
            ]
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        // Generate tokens
        generateTokens(user._id, res);

        res.status(200).json({
            message: "Login successful",
            data: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profilePic: user.profilePic,
                bio: user.bio 
            }
        });
    } catch (error) {
        console.log("Error on login", error);
        res.status(500).json({ message: "Internal server error"});
    }
}

export const logOut = (req, res) => {
    try {
        // Clear cookies
        res.cookie('accessToken', '', { maxAge: 0 });
        res.cookie('refreshToken', '', { maxAge: 0 });

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error on logout", error);
        res.status(500).json({ message: "Internal server error" });
    }
} 

