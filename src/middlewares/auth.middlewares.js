import jwt from 'jsonwebtoken';
import { newUser } from '../model/user.model.js';

const verifyJwt = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        // console.log("token:",token)
        if (!token) {
            return res.status(401).json({ message: "Access token is missing." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("decoded: ", decoded)
        const user = await newUser.findById(decoded.userId).select("-password -refreshToken");
        // console.log("user: ",user)
        if (!user) {
            return res.status(401).json({ message: "Invalid access token." });
        }

        req.user = user;
        console.log("user", req.user)
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
        return res.status(401).json({ message: "Invalid token.", error: error.message });
    }
};

export { verifyJwt };
