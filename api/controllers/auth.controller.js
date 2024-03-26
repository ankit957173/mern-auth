import User from "../models/User.model.js";
//install bcryptjs not bcrypt because bcrypt create some error in the production side
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {

    const { username, email, password } = req.body;
    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    try {
        await newUser.save();
        res.status(201).json({ message: "User Created Successfully" });

    } catch (error) {
        // res.status(500).json(error.message)
        next(error);
    }

    //res.json({ message: "signup is working!!" });
}
export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const validUser = await User.findOne({ email });
        if (!validUser) return next(errorHandler(404, "User not found"));
        const isMatch = await bcryptjs.compare(password, validUser.password);
        if (!isMatch) return next(errorHandler(400, "Wrong Password"));

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        //password is not send in response
        const { password: hashedPassword, ...others } = validUser._doc

        //add cookeies
        res
            .cookie('access_tokern', token, { httpOnly: true, maxAge: 60 * 60 * 1000 })
            .status(200)
            .json(others);
    } catch (error) {
        next(errorHandler(500, "Error in signin"));
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
                .cookie('access_tokern', token, { httpOnly: true, expires: expiryDate })
                .status(200)
                .json(user._doc);
        }
        else {
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