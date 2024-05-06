import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from 'path';
const app = express();

dotenv.config();
mongoose.connect(process.env.MONGO).then(() => {
    console.log("connected to mongoDB");

}).catch((err) => {
    console.log(err);
})
// app.use(cors);
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/client/dist')))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
})
app.use(express.json())
app.use(cookieParser())
app.listen(3000, () => {
    console.log("listening on port 3000!");
})
//paths
app.use("/api/user", userRoutes);
app.use('/api/auth', authRoutes);
//adding middleware
app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    //500 means internal server error
    const message = error.message || "Internal Server Error";
    return res.status(status).json({ success: false, error: message, statusCode: status })
})