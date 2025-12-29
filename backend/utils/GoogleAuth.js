import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/UserModel.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        
        const { email, name, picture, sub } = ticket.getPayload(); 
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                email,
                username: name,
                avatar: picture,
                googleId: sub,
                password: Date.now().toString()
            });
            console.log("New user created via Google Signup");
        }
        const sessionToken = jwt.sign(
            { id: user._id, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
        );
        res.status(200).json({ 
            success: true, 
            message: `Welcome ${user.username}`,
            token: sessionToken,
            user: { 
                email: user.email, 
                username: user.username,  
            } 
        });

    } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(401).json({ success: false, message: "Invalid Google Token" });
    }
};