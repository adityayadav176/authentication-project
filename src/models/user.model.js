import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: true
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
    avatar: {
        type: String, // cloudinary url
        required: true
    },
    coverImage: {
        type: String // cloudinary url
    },
    verifyOtp: {
        type: String,
        default: ""
    },
    verifyOtpExpiredAt: {
        type: Number,
        default: 0
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    },
    resetOtp: {
        type: String,
        default: ''
    },
    resetOtpExpiredAt: {
        type: Number,
        default: 0
    },
    refreshToken: {
        type: String,
    }
}, { timestamps: true })

const userModal = mongoose.model("User", userSchema);
export default userModal;