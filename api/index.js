import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

const app = express();
dotenv.config();

mongoose.connect(process.env.MONGO)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB", err);
    });

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/client/dist')));

app.use(express.json());
app.use(cookieParser());
app.use(cors());  // Enable CORS middleware

// Define routes middleware
app.use("/api/user", userRoutes);
app.use('/api/auth', authRoutes);

// Catch-all route to serve the index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    return res.status(status).json({ success: false, error: message, statusCode: status });
});

app.listen(3000, () => {
    console.log("Backend/Server is listening on port 3000!");
});