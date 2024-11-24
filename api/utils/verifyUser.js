import { errorHandler } from "./error.js";
//.js add krna is also important vrna error deta h
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) return next(errorHandler(401, "You are not authenticated!"));
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(errorHandler(403, "Token is not valid!"));
        req.user = user;
        next();
    });
}
export const verifyCode = async (req, res, next) => {
    try {
        const { email, code } = req.body;
        const user = await User.findOne({ email });
        if (!user || user.verificationCode !== code) {
            return res.status(400).json({ message: "Invalid verification code" });
        }
        res.status(200).json({ message: "Verification successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

