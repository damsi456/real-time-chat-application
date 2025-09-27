import { generateTokens, verifyToken } from "../utils/jwtUtil.js";

export const authenticateUser = (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    
    console.log("Access token present:", !!accessToken);
    console.log("Refresh token present:", !!refreshToken);

    // Verify the access token
    if (accessToken) {
        const decodedAccess = verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET);
        
        if (decodedAccess) {
            req.user = { userId: decodedAccess.userId };
            return next();
        }
        console.log("Access token verification failed. Will try refresh flow.");
    }
    
    // Try to use the refresh token
    if (!refreshToken) {
        return res.status(401).json({ message: "Not authenticated. (No refresh token.)"});
    }
    
    // Verify refresh token
    const decodedRefresh = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    if (!decodedRefresh) {
        return res.status(401).json({ message: "Invalid refresh token."});
    }
    
    // Valid refresh token - Issue new tokens
    generateTokens(decodedRefresh.userId, res);
    console.log("Tokens refreshed successfully");

    req.user = { userId: decodedRefresh.userId };
    next();
}