import User from "../models/User.model.js";
//install bcryptjs not bcrypt because bcrypt create some error in the production side
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { validateEmail, validatePassword, validateUsername } from "../utils/validate.js";
import { generateVerificationCode, sendVerificationEmail } from "../utils/emailOtp.js";

export const signup = async (req, res, next) => {

    const { username, email, password } = req.body;
    if (!email && !password && !username) {
        return next(errorHandler(400, "Please enter Username, Email and Password"));
    }
    if (!username) {
        return next(errorHandler(400, "Please enter Username"));
    }
    const usernameError = validateUsername(username);
    if (usernameError) {
        return next(errorHandler(400, usernameError));
    }
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
        return next(errorHandler(400, "Username already exists"));
    }
    if (!email) {
        return next(errorHandler(400, "Please enter Email"));
    }

    const emailError = validateEmail(email);
    if (emailError) {
        return next(errorHandler(400, emailError));
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
        return next(errorHandler(400, "Email already exists"));
    }
    if (!password) {
        return next(errorHandler(400, "Please enter Password"));
    }



    const passwordError = validatePassword(password);
    if (passwordError) {
        return next(errorHandler(400, passwordError));
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    try {
        await newUser.save();
        res.status(201).json({ message: "User Created Successfully" });
        //after signup 



    } catch (error) {
        // res.status(500).json(error.message)
        next(errorHandler(500, "Internal Server Error"));
    }

    //res.json({ message: "signup is working!!" });
}
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
        if (!validUser) return next(errorHandler(404, "User does not Exist Please Sign Up"));
        const isMatch = await bcryptjs.compare(password, validUser.password);
        if (!isMatch) return next(errorHandler(400, "Wrong Password"));

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        //password is not send in response
        const { password: hashedPassword, ...others } = validUser._doc

        //add cookeies
        res
            .cookie('access_token', token, { httpOnly: true, maxAge: 60 * 60 * 1000 })
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
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            const { password: hashedPassword, ...others } = user._doc;
            const expiryDate = new Date(Date.now() + 60 * 60 * 1000);
            res
                .cookie('access_token', token, { httpOnly: true, expires: expiryDate })
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
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const { password: hashedPassword2, ...rest } = newUser._doc;
            const expiryDate = new Date(Date.now() + 60 * 60 * 1000);
            res
                .cookie('access_token', token, {
                    httpOnly: true,
                    expires: expiryDate
                }).status(200).json(rest);
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
        if (validUser === null) {
            return next(errorHandler(404, "User does not Exist Please Sign Up"));
        }

        const verificationCode = generateVerificationCode();
        await sendVerificationEmail(email, verificationCode);
        validUser.verificationCode = verificationCode;
        await validUser.save();

        res.status(200).json({ message: "Verification code sent successfully", user: validUser });
        // console.log("User found")
        next(); // Pass control to the next middleware function

    } catch (error) {
        console.log(error)
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
        // console.log(req.body.email, req.body.password)

        await User.findOneAndUpdate({ email: req.body.email }, {
            $set: {
                password: req.body.password,
            }
        }, { new: true });
        res.status(200).json({ message: "Password updated successfully" });
        // console.log("password updated successfully")
        next();
    } catch (error) {
        console.log("error in update password controller!!")
    }
}