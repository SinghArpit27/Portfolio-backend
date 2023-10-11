import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // Name is a required field.
    },
    email: {
        type: String,
        required: true, // Email is a required field.
        unique: true, // Enforces uniqueness of email addresses.
    },
    phone: {
        type: String,
        required: true, // Phone number is a required field.
        unique: true, // Enforces uniqueness of phone numbers.
    },
    password: {
        type: String,
        required: true, // Password is a required field.
    },
    linkedin_url: {
        type: String, // LinkedIn profile URL.
    },
    image: {
        type: String, // URL for the avatar image.
        required: true,
    },
    about: {
        name: String, // User's full name.
        professional_title: String, // User's professional title.
        bio_description: String, // User's bio/description.
        // quote: String, // An inspirational quote or tagline.
        // avatar: String, // URL for the avatar image.
    },
    user_role: {
        type: Number,
        default: 2, // User role, with a default value of 2 (you can define role levels elsewhere).
    },
    isVerified: {
        type: Boolean,
        default: false, // Indicates if the user's account is verified.
    },
    isDeleted: {
        type: Boolean,
        default: false, // Indicates if the user's account is deleted.
    },
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps.

export default mongoose.model('User', userSchema);
