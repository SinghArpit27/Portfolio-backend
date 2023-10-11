import User from '../../../models/userModel.js';
import Professional from '../../../models/professionalModel.js';
import httpResponse from '../../../helper/httpResponse.js';
import { responseMessage, responseStatus, statusCode } from '../../../core/responseMessage.js';





class ProfessionalController{

    // Add Projects Controller
    static async addProjects(req, res) {
        try {
            const userId = req.userId;
            const userData = await User.findById({ _id: userId });

            if (userData) {
                const projectData = await Professional.findOne({ userId: userId });

                if (projectData) {
                    // User already has a professional record, add a new project to their existing projects array.
                    const { github_url, live_url, title, description, techStack } = req.body;

                    // Split the techStack string into an array using a comma as the delimiter
                    const techStackArray = techStack.split(',').map(item => item.trim());

                    projectData.projects.push({
                        github_url,
                        live_url,
                        title,
                        avatar: req.file.filename,
                        description,
                        techStack: techStackArray,
                    });

                    const updatedProjectData = await projectData.save();
                    console.log("Update Project : ", updatedProjectData);
                } else {
                    // User doesn't have a professional record, create a new one with the project.
                    const { github_url, live_url, title, description, techStack } = req.body;

                    // Split the techStack string into an array using a comma as the delimiter
                    const techStackArray = techStack.split(',').map(item => item.trim());

                    const newProfessional = new Professional({
                        userId: userId,
                        projects: [
                            {
                                github_url,
                                live_url,
                                title,
                                avatar: req.file.filename,
                                description,
                                techStack: techStackArray,
                            },
                        ],
                    });

                    const newProjectData = await newProfessional.save();
                    console.log("New Project : ", newProjectData);
                }

                httpResponse(res, statusCode.CREATED, responseStatus.SUCCESS, responseMessage.PROJECT_ADDED);
            } else {
                httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.UNAUTHORIZED);
            }
        } catch (error) {
            httpResponse(res, statusCode.INTERNAL_SERVER_ERROR, responseStatus.FAILURE, responseMessage.INTERNAL_SERVER_ERROR);
        }
    }

    // Add Technical Skills Controller
    static async addTechnicalSkills(req, res) {
        try {
            const userId = req.userId;
            const userData = await User.findById({ _id: userId });

            if (userData) {
                const skills = req.body.technicalSkills;

                // Split the skills string into an array using a comma as the delimiter
                const skillsArray = skills.split(',').map(item => item.trim());

                const projectData = await Professional.findOne({ userId: userId });

                if (projectData) {
                    // User already has a professional record, update the technical skills.
                    projectData.technicalSkills = skillsArray;
                    await projectData.save();
                } else {
                    // User doesn't have a professional record, create a new one with the technical skills.
                    const newProfessional = new Professional({
                        userId: userId,
                        technicalSkills: skillsArray,
                    });

                    await newProfessional.save();
                }

                httpResponse(res, statusCode.OK, responseStatus.SUCCESS, responseMessage.TECHNICAL_SKILLS_ADDED);
            } else {
                httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.UNAUTHORIZED);
            }
        } catch (error) {
            httpResponse(res, statusCode.INTERNAL_SERVER_ERROR, responseStatus.FAILURE, responseMessage.INTERNAL_SERVER_ERROR);
        }
    }

    // Add Experience Controller
    static async addExperience(req, res) {
        try {
            const userId = req.userId;
            const userData = await User.findById({ _id: userId });

            if (userData) {
                const { title, company, location, startDate, endDate, currently_working, description } = req.body;
                const projectData = await Professional.findOne({ userId: userId });

                if (projectData) {
                    // User already has a professional record, add a new experience to their existing experience array.
                    projectData.experience.push({
                        title,
                        company,
                        location,
                        startDate,
                        endDate,
                        currently_working,
                        description,
                    });

                    await projectData.save();
                } else {
                    // User doesn't have a professional record, create a new one with the experience.
                    const newProfessional = new Professional({
                        userId: userId,
                        experience: [
                            {
                                title,
                                company,
                                location,
                                startDate,
                                endDate,
                                currently_working,
                                description,
                            },
                        ],
                    });

                    await newProfessional.save();
                }

                httpResponse(res, statusCode.OK, responseStatus.SUCCESS, responseMessage.EXPERIENCE_ADDED);
            } else {
                httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.UNAUTHORIZED);
            }
        } catch (error) {
            httpResponse(res, statusCode.INTERNAL_SERVER_ERROR, responseStatus.FAILURE, responseMessage.INTERNAL_SERVER_ERROR);
        }
    }

}

export default ProfessionalController;



// httpResponse(res, statusCode.INTERNAL_SERVER_ERROR, responseStatus.FAILURE, responseMessage.INTERNAL_SERVER_ERROR);