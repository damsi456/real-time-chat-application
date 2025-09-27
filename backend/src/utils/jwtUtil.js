import jwt from 'jsonwebtoken'

export const generateTokens = (userId, res) =>  {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1m'
    });

    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '7d'
    });

    // Set cookies
    res.cookie('accessToken', accessToken, {
        maxAge: 15 * 60 * 1000,    
        httpOnly: true, // the passed cookie can't be accessed by client-side js
        sameSite: 'strict',
        secure: process.env.NODE_ENV !== "development"
    });

    res.cookie('refreshToken', refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000,    
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV !== "development"
    });

    return { accessToken, refreshToken };
}

export const verifyToken = (token, secret) => {
    try {
        return jwt.verify(token, secret);
    } catch {
        return null;
    }
}