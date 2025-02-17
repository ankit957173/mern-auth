import mongoose from "mongoose";
const temporaryUserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: '5m' } // Expires after 1 hour
});

const TemporaryUser = mongoose.model('TemporaryUser', temporaryUserSchema);
export default TemporaryUser;