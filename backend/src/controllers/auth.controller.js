import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwtUtil.js";

export async function signUp(req, res) {
    try {
        const { username, email, password, bio } = req.body;

        if (!username, !email, !password) {
            return res.status(200).json({
                message: "All required fields should be filled."
            })
        }
        // Input validation
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
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            bio: bio || ''
        })

        if (newUser) {
            await newUser.save();
            generateToken(newUser._id, res);

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

export async function logIn (req, res) {

}

export async function logOut (req, res) {

} 