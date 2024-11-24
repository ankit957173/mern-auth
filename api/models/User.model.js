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
    profilePicture: {
        type: String,
        default: "https://th.bing.com/th/id/OIP.lcdOc6CAIpbvYx3XHfoJ0gAAAA?rs=1&pid=ImgDetMain"
    },
    savedData: {
        type: Array,
        default: []
    }, verificationCode: {
        type: String
    }

},
    //means each user has a timestamp and sort them 
    //in any order as required
    {
        timestamps: true
    });
const User = mongoose.model('User', userSchema);
export default User;