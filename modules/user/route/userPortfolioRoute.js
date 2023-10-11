// Import express and use express app named portfolioRoute
import express from 'express';
import { authenticateToken } from '../../../middleware/jwtAuthorization.js';
const portfolioRoute = express();

// middlewares
portfolioRoute.use(express.json());
portfolioRoute.use(express.urlencoded({ extended: true }));
portfolioRoute.use(authenticateToken);


// Import Professcont and use it in routes
import ProfessionalController from '../controller/userPortfolioController.js'
import { projectAvatar } from '../../../middleware/multerUploads.js';

// Add Projects Route POST Request
portfolioRoute.post('/add-projects', projectAvatar.single('avatar'), ProfessionalController.addProjects);

// Add Technical Skills Route POST Request
portfolioRoute.post('/add-technical-skills', ProfessionalController.addTechnicalSkills);

// Add Experience Route POST Request
portfolioRoute.post('/add-experience', ProfessionalController.addExperience);


export default portfolioRoute;
