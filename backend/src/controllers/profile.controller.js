import cloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";

export const updateProfile = async (req, res) => {
    try {
        const { bio } = req.body;
        const userId = req.user._id;
        const profilePicFile = req.file;

        console.log("File received:", req.file ? "Yes" : "No");

        // What to be updated
        const updateData = {};

        // Only add bio if it exists
        if (bio !== undefined) {
            updateData.bio = bio;
        }

        // Only upload image if its provided
        if (profilePicFile) {
            // Converting to base 64 as it's supported by cloudinary. (as we're using memorystroge in multer and not saving to the disk.)
            const fileBase64 = `data:${profilePicFile.mimetype};base64,${profilePicFile.buffer.toString('base64')}`;

            const uploadResponse = await cloudinary.uploader.upload(fileBase64);
            updateData.profilePic = uploadResponse.secure_url;
        }

        // Only update if there are changes
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No valid data is provided to update."});
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        ).select("-password");

        res.status(200).json({ 
            message: "User profile updated successfully.", 
            user: updatedUser
        });

    } catch (error) {
        console.log("Error in updating profile.", error);
        res.status(500).json({ message: "Internal server error." });
    }
}
