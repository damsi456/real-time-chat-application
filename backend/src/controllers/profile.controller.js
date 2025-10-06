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

            // Delete user's old image
            const user = await User.findById(userId);
            if (user.profilePic && user.profilePic.publicId) {
                await cloudinary.uploader.destroy(user.profilePic.publicId);
            }

            const uploadResponse = await cloudinary.uploader.upload(fileBase64);
            updateData.profilePic = {
                url: uploadResponse.secure_url,
                publicId: uploadResponse.public_id
            };
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

export const deleteProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findByIdAndDelete(userId);
        
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        // Delete pfp
        if (user.profilePic && user.profilePic.publicId) {
            try {
                await cloudinary.uploader.destroy(user.profilePic.publicId);
            } catch (err) {
                console.log("Error deleting profile image from Cloudinary", err);
            }
        }

        // Clear auth cookies
        res.cookie('accessToken', '', { maxAge: 0 });
        res.cookie('refreshToken', '', { maxAge: 0 });

        res.status(200).json({ message: "User profile deleted successfully!" });

    } catch (error) {
        console.log("Error deleting user profile.", error);
        res.status(500).json({ message: "Failed to delete user profile." });
    }
}