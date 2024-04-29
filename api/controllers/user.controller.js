import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import User from "../models/User.model.js";

export const test = (req, res) => {
    res.json({ message: "Api is working!" });
}
const validatePassword = (password) => {
    // Check if password length is at least 5 characters
    if (!password || password.length < 5) return "Password must be at least 5 characters long.";

    // Check if password contains at least one special character
    if (!/[!@#$%^&*()-_=+{}|<>?~]/.test(password)) return "Password must contain at least 1 special character.";


    // Check if password contains any spaces
    if (/\s/.test(password)) return "Password must not contain spaces.";

    return null; // Password is valid
};
// const validateEmail = (email) => {
//     // Check if email is valid
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email format.";
//     return null; // Email is valid
// }
// const validateUsername = (username) => {
//     // Check if username contains any spaces
//     if (/\s/.test(username)) return "Username must not contain spaces.";

//     return null; // Username is valid
// };
export const updateUser = async (req, res, next) => {
    const passwordError = validatePassword(req.body.password);
    if (passwordError) {
        return next(errorHandler(400, passwordError));
    }

    // const emailError = validateEmail(req.body.email);
    // if (emailError) {
    //     return next(errorHandler(400, emailError));
    // }

    // const usernameError = validateUsername(req.body.username);
    // if (usernameError) {
    //     return next(errorHandler(400, usernameError));
    // }

    // Check if username already exists
    const existingUsername = await User.findOne({ username: req.body.username });
    if (existingUsername) {
        return next(errorHandler(400, "Username already exists."));
    }

    if (req.user.id !== req.params.id) {
        return next(errorHandler(403, "You can update only your account!"));
    }
    try {
        if (req.body.password) {
            req.body.password = await bcryptjs.hash(req.body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                profilePicture: req.body.profilePicture

            }
        }, { new: true });
        const { password, ...others } = updatedUser._doc;
        res.status(200).json(others);
    } catch (error) {
        next(error);
    }
}
export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(403, "You can delete only your account!"));
    }
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted successfully!");
    } catch (error) {
        next(error);
    }
}

