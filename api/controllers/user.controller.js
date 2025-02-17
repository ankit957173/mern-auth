import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import User from "../models/User.model.js";
import { validateEmail, validatePassword, validateUsername } from "../utils/validate.js";

export const test = (req, res) => {
    res.json({ message: "Api is working!" });
    console.log("/  is working");
}
export const updateUser = async (req, res, next) => {
    const validUsername = validateUsername(req.body.username);
    if (validUsername) return next(errorHandler(400, validUsername));
    const existingUsername = await User.findOne({ username: req.body.username });
    if (existingUsername && existingUsername._id.toString() !== req.params.id) {
        return next(errorHandler(400, "Username already exists."));
    }

    const validEmail = validateEmail(req.body.email);
    if (validEmail) return next(errorHandler(400, validEmail));
    const existingEmail = await User.findOne({ email: req.body.email });
    if (existingEmail && existingEmail._id.toString() !== req.params.id) {
        return next(errorHandler(400, "Email already exists. Please choose a different email."));
    }
    if (req.user.id !== req.params.id) {
        return next(errorHandler(403, "You can update only your account!"));
    }

    const passwordError = validatePassword(req.body.password);
    if (passwordError) {
        return next(errorHandler(400, passwordError));
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
    try {
        console.log('Authenticated User ID:', req.user.id); // Log the authenticated user's ID
        console.log('Request Params ID:', req.params.id); // Log the ID from the request parameters

        // Check if the user is trying to delete their own account
        if (req.user.id !== req.params.id) {
            console.log('Mismatch IDs - Authenticated user can only delete their own account.');
            return next(errorHandler(403, "You can delete only your account!"));
        }

        await User.findByIdAndDelete(req.params.id); // Proceed to delete the user account
        res.status(200).json("User has been deleted successfully!");
    } catch (error) {
        next(error); // Handle any errors
    }
};

export const getPasswords = async (req, res, next) => {

    try {

        const user = await User.findById(req.params.id);

        if (user) {
            const savedData = user.savedData; // Extract the savedData array from the user document
            return res.status(200).json(savedData); // Return the savedData array directly
        } else {
            return res.status(404).json({ message: "User does not Exist Please Create an Account" }); // Corrected typo
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
            res.status(404).json({ message: "User does not Exist Please Create an Account" });
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
            res.status(404).json({ message: "User does not Exist Please Create an Account" });
        }
    } catch (error) {
        next(error); // Pass any errors to the error handling middleware
    }
}

