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
    },
    signUpOtp: {
        type: String
    },
    profilePicture: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png"
    },
    savedData: {
        type: Array,
        default: []
    }, verificationCode: {
        type: String
    }, verified: { type: Boolean, default: false }

},
    //means each user has a timestamp and sort them 
    //in any order as required
    {
        timestamps: true
    });
const User = mongoose.model('User', userSchema);
export default User;