import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({
            _id: {$ne: loggedInUserId}
        }).select("-password");

        res.status(200).json({
            message: "Users successfully fetched.",
            data: filteredUsers
        });
    } catch (error) {
        console.log("Error on fetching users", error);
        res.status(500).json({ message: "Couldn't fetch users" });
    }
}

export const getMessages = async (req, res) => {
    try {
        const { userId: userToChatId } = req.params;
        const currentUserId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: currentUserId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: currentUserId }
            ]
        });

        res.status(200).json({
            message: "Messages fetched successfully.",
            data: messages
        })    
    } catch (error) {
        console.log("Error on getting messages.", error);
        res.status(500).json({ message: "Couldn't get messages." });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text } = req.body;
        const imageFile = req.file;
        const { userId: receiverId } = req.params;
        const senderId = req.user._id;

        // Validation
        if ((!text || text.trim() ==='') && !imageFile) {
            return res.status(400).json({
                message: "Message cannot be empty. Please provide text or an image."
            })
        }

        console.log("File (message image) received:", req.file ? "Yes" : "No");

        let imageUrl;
        let imagePublicId;
        if (imageFile) {
            // Converting to base 64 as it's supported by cloudinary. (as we're using memorystroge in multer and not saving to the disk.)
            const fileBase64 = `data:${imageFile.mimetype};base64,${imageFile.buffer.toString('base64')}`;
            const uploadResponse = await cloudinary.uploader.upload(fileBase64);
            imageUrl = uploadResponse.secure_url;
            imagePublicId = uploadResponse.public_id;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text: text || '',
            image: {
                url: imageUrl,
                publicId: imagePublicId
            } 
        })

        await newMessage.save();

        // socketio

        res.status(201).json(newMessage)
    } catch (error) {
        console.log("Error on sending message", error);
        res.status(500).json({ message: "Couldn't send message." });
    }
}