import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import { sendOtp } from "../utils/signUpOtp.js";
import TemporaryUser from "../models/TemporaryUser.js";



export const verifyToken = async (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) return next(errorHandler(401, "You are not authenticated!"));

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);

        if (!user) {
            return next(errorHandler(404, "User not found in the database."));
        }

        req.user = user;
        next();
    } catch (err) {
        console.log("Token verification failed:", err);
        return next(errorHandler(403, "Token is not valid!"));
    }
};

export const verifyCode = async (req, res, next) => {
    try {
        const { email, code } = req.body;
        const user = await User.findOne({ email });
        if (!user || user.verificationCode !== code) {
            return next(errorHandler(400, "Invalid verification code"));
        }
        res.status(200).json({ message: "Verification successful" });
    } catch (error) {
        console.error("verifyCode error:", error);
        next(errorHandler(500, "Internal Server Error in verifyCode"));
    }
};

export const verifyCodeSignUp = async (req, res, next) => {
    const { email, otp } = req.body;
    if (!otp) return next(errorHandler(400, "Please enter OTP"));

    try {
        const tempUser = await TemporaryUser.findOne({ email, otp });
        if (!tempUser) {
            return next(errorHandler(400, "Invalid OTP or OTP expired. Please try again."));
        }
        const newUser = new User({
            _id: tempUser._id,
            username: tempUser.username,
            email: tempUser.email,
            password: tempUser.password,
            verified: true
        });
        await newUser.save();
        await TemporaryUser.deleteOne({ _id: tempUser._id });
        res.status(201).json({ success: true, message: "OTP Verification successful", user: newUser });
    } catch (error) {
        console.error("OTP verification error:", error);
        next(errorHandler(500, "Internal Server Error in verifyCodeSignUp"));
    }
};

export const resendOtp = async (req, res, next) => {
    const { email } = req.body;
    if (!email) return next(errorHandler(400, "Email is required"));

    try {
        const tempUser = await TemporaryUser.findOne({ email });
        if (!tempUser) return next(errorHandler(400, "User not found. Please sign up."));

        const otp = generateOtp();
        tempUser.otp = otp;
        tempUser.createdAt = Date.now(); // Reset createdAt to now for new TTL
        await tempUser.save();
        await sendOtp(email, otp);
        res.status(200).json({ message: "OTP resent to email." });
    } catch (error) {
        next(errorHandler(500, "Internal Server Error in resendOtp"));
    }
};