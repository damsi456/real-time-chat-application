import jwt from 'jsonwebtoken'

export const generateToken = (userId, res) =>  {
    const accessToken = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '7d'
    })

    res.cookie('accessToken', accessToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000,    
        httpOnly: true, // cookie can't be accessed through js
        sameSite: 'strict',
        secure: process.env.NODE_ENV !== "development"
    })

    return accessToken;
}