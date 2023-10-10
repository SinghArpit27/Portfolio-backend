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
    experience: [
        {
            title: String, // Job title
            company: String, // Company name
            location: String, // Location of the job
            startDate: Date, // Start date of the job
            endDate: Date, // End date of the job
            description: String, // Description of the role and responsibilities
        },
    ],
    projects: [
        {
            github_url: String, // GitHub repository URL for a project.
            live_url: String, // Live project URL.
            title: String, // Title of the project.
            image: {
                public_id: String, // Public ID for an image (e.g., cloud storage reference).
                url: String, // URL for the project image.
            },
            description: String, // Description of the project.
            techStack: String, // Technologies used in the project.
        },
    ],
    about: {
        name: String, // User's full name.
        title: String, // User's professional title.
        subtitle: String, // A subtitle, if needed.
        description: String, // User's bio/description.
        quote: String, // An inspirational quote or tagline.
        avatar: {
            public_id: String, // Public ID for the avatar image.
            url: String, // URL for the avatar image.
        },
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
