import User from "../models/user.model.js";
import { generateTokens, verifyToken } from "../utils/jwtUtil.js";

export const authenticateUser = async (req, res, next) => {
    try{
        const accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;
        
        console.log("Access token present:", !!accessToken);
        console.log("Refresh token present:", !!refreshToken);

        // Verify the access token
        if (accessToken) {
            const decodedAccess = verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET);
            
            if (decodedAccess) {
                // Get user data for access token
                const user = await User.findById(decodedAccess.userId).select("-password");

                if (!user) {
                    console.log("User not found for the access token.");
                    return res.status(401).json({ message: "User not found" });
                }

                req.user = user;
                return next();
            } else {
                console.log("Access token verification failed. Will try refresh flow.");
            }
        }
        
        // Try to use the refresh token
        if (!refreshToken) {
            return res.status(401).json({ message: "Not authenticated."});
        }
        
        // Verify refresh token
        const decodedRefresh = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        
        if (!decodedRefresh) {
            return res.status(401).json({ message: "Invalid refresh token."});
        }

        // Get user data for refresh token
        const user = await User.findById(decodedRefresh.userId).select("-password");
        
        if (!user) {
            return res.status(401).json({ message: "User not found." });
        }
        
        // Valid refresh token - Issue new tokens
        generateTokens(decodedRefresh.userId, res);
        console.log("Tokens refreshed successfully");

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in authenticating user: ", error.message);
        res.status(500).json({ message: "Internal server error."})
    }
}