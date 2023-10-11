// Import express and make express app named userRoute
import express from 'express';
const userRoute = express();


userRoute.use(express.json());
userRoute.use(express.urlencoded({ extended: true }));


// Import UserController Class and Use it's Method
import UserController from '../controller/userController.js';

// Import User Validation File And Validation Error File
import { loginValidation, otpValidation, passwordValidation, registerValidation, renewAccessTokenValidation, resendOtpValidation, updateProfileValidation } from '../../../middleware/userValidation.js';
import { expressValidationResult } from '../../../helper/validationError.js';

// Import Middleware for user Authentication
import { authenticateToken } from '../../../middleware/jwtAuthorization.js';
import { upload } from '../../../middleware/multerUploads.js';

// Routes Definitions For USER AUTH MODULE

// User Registration Route POST Request
userRoute.post('/register', upload.single('image'), registerValidation, expressValidationResult, UserController.userRegister);

// User Email Verification POST Request
userRoute.post('/email-verification', otpValidation, expressValidationResult, UserController.OTPVerification);

// Resend OTP Route POST Request
userRoute.post('/resend-otp', resendOtpValidation, expressValidationResult, UserController.resendOTP);

// User Login Route POST Request
userRoute.post('/login', loginValidation, expressValidationResult, UserController.userLogin);

// Renew Access Token Route POST Request
userRoute.post('/renewAccessToken', renewAccessTokenValidation, expressValidationResult, UserController.renewAccessToken);

// Forget Password Route POST Request
userRoute.post('/forget-password', loginValidation, expressValidationResult, UserController.userForgetPassword);

// Reset Password Route When User Logged in POST Request
userRoute.post('/reset-password', passwordValidation, expressValidationResult, authenticateToken, UserController.userResetPassword);

// Change User Profile Route POST Request
userRoute.post('/update-profile', updateProfileValidation, expressValidationResult, authenticateToken, UserController.userProfileUpdate);


export default userRoute;


