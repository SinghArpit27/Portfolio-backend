import mongoose from "mongoose";
const otpSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    otp_expiration_time: {
        type: Number,
        required: true,
    },

}, { timestamps: true });

export default mongoose.model('Otp', otpSchema);