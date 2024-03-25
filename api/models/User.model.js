import { Timestamp } from "bson";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
},
    //means each user has a timestamp and sort them 
    //in any order as required
    {
        timestamps: true
    });
const User = mongoose.model('User', userSchema);
export default User;