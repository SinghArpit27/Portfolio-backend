import mongoose from 'mongoose';

const professionalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Reference the User model
    },
    projects: [
        {
            github_url: String, // GitHub repository URL for a project.
            live_url: String, // Live project URL.
            title: String, // Title of the project.
            avatar: String, // URL for the project image.
            description: String, // Description of the project.
            techStack: [String], // Technologies used in the project.
        },
    ],
    experience: [
        {
            title: String, // Job title
            company: String, // Company name
            location: String, // Location of the job
            startDate: Date, // Start date of the job
            endDate: Date, // End date of the job
            currently_working: String, // status of the job
            description: String, // Description of the role and responsibilities
        },
    ],
    technicalSkills: [String], // You can store technical skills as an array of strings
}, { timestamps: true });

export default mongoose.model('Professional', professionalSchema);