import User from "../models/User.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { validateEmail, validatePassword, validateUsername } from "../utils/validate.js";
import { generateOtp, sendVerificationEmail } from "../utils/forgetpassOtp.js";
import { sendOtp } from "../utils/signUpOtp.js";
import TemporaryUser from "../models/TemporaryUser.js";

const cookieOptions = {
    httpOnly: true,
    maxAge: 60 * 60 * 1000, // 1 hour
};

if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true; // send cookie over HTTPS only
}

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return next(errorHandler(400, "Please enter Username, Email, and Password"));
    }

    // Validate username
    const usernameError = validateUsername(username);
    if (usernameError) {
        return next(errorHandler(400, usernameError));
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
        return next(errorHandler(400, "Username already exists"));
    }

    // Validate email
    const emailError = validateEmail(email);
    if (emailError) {
        return next(errorHandler(400, emailError));
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
        return next(errorHandler(400, "Email already exists. Please login"));
    }

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
        return next(errorHandler(400, passwordError));
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    try {
        // Check and delete any existing temporary user with the same email
        const existingTempUser = await TemporaryUser.findOne({ email });
        if (existingTempUser) {
            await TemporaryUser.findOneAndDelete({ email });
        }

        // Generate OTP and send it to the user's email
        const otp = generateOtp();
        await sendOtp(email, otp);

        // Create a new temporary user
        const tempUser = new TemporaryUser({ username, email, password: hashedPassword, otp, verified: false });
        await tempUser.save();

        // Generate JWT token
        const token = jwt.sign({ id: tempUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('access_token', token, cookieOptions);

        // Respond with success message and user info
        res.status(200).json({ success: true, message: "OTP sent to your email. Please verify it.", user: { username, email } });
    } catch (error) {
        console.error("Error in signup controller:", error); // Log the error for debugging
        next(errorHandler(500, "Internal Server Error in signup controller"));
    }
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email && !password) {
        return next(errorHandler(400, "Please enter Email and password"));
    }
    if (!email) return next(errorHandler(400, "Please enter Email"));
    const validEmail = validateEmail(email);
    if (validEmail) return next(errorHandler(400, validEmail));
    if (!password) return next(errorHandler(400, "Please enter Password"));
    const passwordError = validatePassword(password);
    if (passwordError) return next(errorHandler(400, passwordError));
    try {
        const validUser = await User.findOne({ email });
        if (!validUser) return next(errorHandler(404, "User does not Exist Please Create an Account"));
        const isMatch = await bcryptjs.compare(password, validUser.password);
        if (!isMatch) return next(errorHandler(400, "Wrong Password"));

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        //password is not send in response
        const { password: hashedPassword, ...others } = validUser._doc

        //add cookeies
        res
            .cookie('access_token', token, cookieOptions)
            .status(200)
            .json(others);
    } catch (error) {
        next(errorHandler(500, "Error in Signin"));
    }
}

export const google = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            const { password: hashedPassword, ...others } = user._doc;
            res
                .cookie('access_token', token, cookieOptions)
                .status(200)
                .json(user._doc);
        }
        else {
            // console.log(req.body.photo)
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = await bcryptjs.hash(generatedPassword, 10);
            const newUser = new User({
                username: req.body.name.split(" ").join("").toLowerCase()
                    +
                    Math.floor(Math.random() * 10000).toString()
                , email: req.body.email,
                password: hashedPassword,
                profilePicture: req.body.photo
            });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            const { password: hashedPassword2, ...rest } = newUser._doc;
            res
                .cookie('access_token', token, cookieOptions)
                .status(200)
                .json(rest);
        }
    } catch (error) {
        next(error);

    }
}

export const signout = async (req, res, next) => {
    res.clearCookie("access_token");
    res.status(200).json("Signout Successful!");
}

export const findemail = async (req, res, next) => {
    try {
        const email = req.body.email;
        const validEmail = validateEmail(email);
        if (validEmail) return next(errorHandler(400, validEmail));
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(404, "User does not Exist Please Create an Account"));
        }

        const verificationCode = generateOtp();
        await sendVerificationEmail(email, verificationCode);
        validUser.verificationCode = verificationCode;
        await validUser.save();

        res.status(200).json({ message: "Verification code sent successfully", user: validUser });
    } catch (error) {
        next(errorHandler(500, "Internal Server Error in findemail controller"));
    }
}

export const updatepassword = async (req, res, next) => {
    try {
        const { password } = req.body;
        if (!password) return next(errorHandler(400, "Please enter password"))
        const passwordError = validatePassword(password);
        if (passwordError) {
            return next(errorHandler(400, passwordError));
        }

        if (req.body.password) {
            req.body.password = await bcryptjs.hash(req.body.password, 10);
        }

        await User.findOneAndUpdate({ email: req.body.email }, {
            $set: {
                password: req.body.password,
            }
        }, { new: true });
        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        next(errorHandler(500, "Internal Server Error in updatepassword controller"));
    }
}

export const checkVerified = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || !user.verified) {
            return next(errorHandler(403, "Access denied. Please verify your account first."));
        }
        next();
    } catch (error) {
        next(errorHandler(500, 'Internal Server Error in checkVerified middleware'));
    }
}

export const getUserProfile = async (req, res, next) => {
    try {
        // Find user by ID. Assuming req.user.id contains the authenticated user's ID.
        const user = await User.findById(req.user._id).select('-password'); // Exclude the password field

        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        next(errorHandler(500, 'Internal Server Error in getUserProfile controller'));
    }
};