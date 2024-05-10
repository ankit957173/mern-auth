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
    if (!/(?=.*[!@#\$%\^&\*])/.test(password)) return "Password must contain at least 1 special character.";


    // Check if password contains any spaces
    if (/\s/.test(password)) return "Password must not contain spaces.";

    return null; // Password is valid
};

export const updateUser = async (req, res, next) => {
    const passwordError = validatePassword(req.body.password);
    if (passwordError) {
        return next(errorHandler(400, passwordError));
    }
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

export const getPasswords = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            const savedData = user.savedData; // Extract the savedData array from the user document
            return res.status(200).json(savedData); // Return the savedData array directly
        } else {
            return res.status(404).json({ message: "User does not Exist Please Sign Up" }); // Corrected typo
        }
    } catch (error) {
        next(error);
    }
}




export const pushPassword = async (req, res, next) => {
    try {
        const { site, username, password, id } = req.body;

        // Find the user by ID
        const user = await User.findById(req.params.id);

        // If user is found
        if (user) {
            // Push the new password data into the savedData array
            user.savedData.push({ site, username, password, id });

            await user.save(); // Save the updated user document
            res.status(200).json({ message: "Password saved successfully" });
        } else {
            res.status(404).json({ message: "User does not Exist Please Sign Up" });
        }
    } catch (error) {
        next(error); // Pass any errors to the error handling middleware
    }
}

export const deleteParticularPassword = async (req, res, next) => {
    try {
        // Find the user by ID
        const user = await User.findById(req.params.id);

        // If user is found
        if (user) {
            // Filter out the password entry with the specified UUID
            user.savedData = user.savedData.filter(data => data.id !== req.params.uuid);

            // Save the updated user document
            await user.save();

            res.status(200).json({ message: "Password deleted successfully" });
        } else {
            res.status(404).json({ message: "User does not Exist Please Sign Up" });
        }
    } catch (error) {
        next(error); // Pass any errors to the error handling middleware
    }
}

