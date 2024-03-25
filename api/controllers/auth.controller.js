import User from "../models/User.model.js";
//install bcryptjs not bcrypt because bcrypt create some error in the production side
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

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