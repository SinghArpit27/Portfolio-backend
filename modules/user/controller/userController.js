import { responseMessage, responseStatus, statusCode } from '../../../core/responseMessage.js';
import httpResponse from '../../../helper/httpResponse.js';
import User from '../../../models/userModel.js';
import OTP from '../../../models/userOtpVerificationModel.js';
import bcrypt from 'bcrypt';
import sendVerifyMail from '../../../helper/userVerification.js';
import { createAccessToken, createRefreshToken } from '../../../middleware/jwtAuthentication.js';
import jwt from 'jsonwebtoken';


// Generate a random OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

class UserController{

    // User Registration Controller
    static async userRegister(req,res){
        try {

            // Generate a new OTP and set the expiration time
            const otp = generateOTP();
            const otpExp = new Date(Date.now() + 30 * 60000).getTime(); // 30 minutes


            const userEmail = await User.findOne({ email: req.body.email });
            if(!userEmail){
                const userPhone = await User.findOne({ phone: req.body.phone });
                if(!userPhone){
                    const hashPassword = await bcrypt.hash(req.body.password, 10);
                    const newUser = await new User({
                        name: req.body.name,
                        email: req.body.email,
                        phone: req.body.phone,
                        password: hashPassword,
                        linkedin_url: req.body.linkedin_url,
                        image: req.file.filename,
                        about: {
                            name: req.body.name,
                            professional_title: req.body.professional_title,
                            bio_description: req.body.bio_description,
                        },
                    });

                    const userData = await newUser.save();
                    if(userData){

                        const newOTP = await new OTP({
                            userId: userData._id,
                            otp: otp,
                            otp_expiration_time: otpExp
                        });
                        const otpData = await newOTP.save();
                        console.log("User Data : " + userData + "\n\n" + "User OTP Details : " + otpData);

                        const responseData = {
                            Name: userData.name,
                            Email: userData.email,
                            Phone: userData.phone,
                            OTP: otp
                        }
                        sendVerifyMail(userData.name, userData.email, otp);
                        console.log("Response Data : ", responseData);
                        httpResponse(res, statusCode.CREATED, responseStatus.SUCCESS, responseMessage.REGISTRATION_SUCCESS, responseData);

                    }else{
                        httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.REGISTRATION_FAILED);
                    }
                }else{
                    httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.PHONE_ALREADY_EXIST);
                }
            }else{
                httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.EMAIL_ALREADY_EXIST)
            }
        } catch (error) {
            httpResponse(res, statusCode.INTERNAL_SERVER_ERROR, responseStatus.FAILURE, responseMessage.INTERNAL_SERVER_ERROR);
        }
    }

    // OTP Verification Controller
    static async OTPVerification(req,res){
        try {
            
            const otp = req.body.otp;
            const email = req.body.email;

            const userData = await User.findOne({ email: email });
            if(userData){
                const otpData = await OTP.findOne({ userId: userData._id });
                const checkOtpExpiration = new Date(Date.now()).getTime(); // 30 minutes

                if(otpData.otp_expiration_time < checkOtpExpiration){
                    httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.OTP_EXPIRED);
                }else if(userData.isVerified == true){
                    httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.ALREADY_VERIFIED);
                }
                else if(otpData.otp == otp && otpData.otp_expiration_time > checkOtpExpiration){
                    const updateInfo = await User.findByIdAndUpdate({ _id: userData._id}, { $set:{ isVerified: true } });
                    httpResponse(res, statusCode.OK, responseStatus.SUCCESS, responseMessage.OTP_VERIFIED_SUCCESSFULLY);
                }
                else{
                    httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.INVALID_OTP);
                }
            }else{
                httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.EMAIL_NOT_FOUND);
            }
        } catch (error) {
            httpResponse(res, statusCode.INTERNAL_SERVER_ERROR, responseStatus.FAILURE, responseMessage.INTERNAL_SERVER_ERROR);
        }
    }

    // Resend OTP Controller
    static async resendOTP(req,res){
        try {
            
            const email = req.body.email;

            const userData = await User.findOne({ email });
            if(userData){
                if(userData.isVerified == false){

                    // Generate a new OTP and set the expiration time
                    const otp = generateOTP();
                    const otpExp = new Date(Date.now() + 30 * 60000).getTime(); // 30 minutes

                    sendVerifyMail(userData.name, userData.email, otp);

                    const updateInfo = await OTP.updateOne({ userId: userData._id}, { $set:{ otp_expiration_time: otpExp, otp: otp } });

                    httpResponse(res, statusCode.CREATED, responseStatus.SUCCESS, responseMessage.OTP_SEND);

                }else{
                    httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.ALREADY_VERIFIED);
                }
            }else{
                httpResponse(res, statusCode.NOT_FOUND, responseStatus.FAILURE, responseMessage.EMAIL_NOT_FOUND);
            }
        } catch (error) {
            httpResponse(res, statusCode.INTERNAL_SERVER_ERROR, responseStatus.FAILURE, responseMessage.INTERNAL_SERVER_ERROR);
        }
    }

    // User Login Controller
    static async userLogin(req,res){
        try {
            
            const userData = await User.findOne({ email: req.body.email });
            if(userData){
                const checkPassword = await bcrypt.compare(req.body.password, userData.password);
                if(checkPassword){
                    if(userData.isDeleted == false){
                        if(userData.isVerified == true){

                            // JWT Authentication logic
                            const token = {
                                accessToken: await createAccessToken(userData._id),
                                refreshToken: await createRefreshToken(userData._id)
                            }
                            httpResponse(res, statusCode.OK, responseStatus.SUCCESS, responseMessage.LOGIN_SUCCESS, token);

                        }else{
                            httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.NOT_VERIFIED);
                        }
                    }else{
                        httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.USER_DELETED);
                    }
                }else{
                    httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.INCORRECT_CREDENTIALS);
                }
            }else{
                httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.INCORRECT_CREDENTIALS);
            }
    
        } catch (error) {
            httpResponse(res, statusCode.INTERNAL_SERVER_ERROR, responseStatus.FAILURE, responseMessage.INTERNAL_SERVER_ERROR);
        }
    }

    // Re-generate Access Token Controller
    static async renewAccessToken(req,res){
        try {
        
            const refreshToken = req.body.token;
            if (refreshToken) {
                // Verify Refresh Token
                jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET, async (err, decoded) => {
                    if (!err) {
                        const user = decoded; // The user data decoded from the token
                        const userData = await User.findById({ _id: user._id });
                        if(userData){
                            // console.log(userData);
                            if(userData.isDeleted == false){
                
                                // Create New Acces token
                                const token = {
                                    accessToken: await createAccessToken(userData._id),
                                    refreshToken: refreshToken
                                }
                                httpResponse(res, statusCode.OK, responseStatus.SUCCESS, responseMessage.SUCCESS, token);
                
                            }else{
                                httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.USER_DELETED);
                            }
                        }else{
                            httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.UNAUTHORIZED);
                        }
                    } else {
                        // console.log("Not Verified refresh token")
                        httpResponse(res, statusCode.UNAUTHORIZED, responseStatus.FAILURE, responseMessage.UNAUTHORIZED);
                    }
                });
            }else{
                httpResponse(res, statusCode.UNAUTHORIZED, responseStatus.FAILURE, responseMessage.UNAUTHORIZED);
            }
        } catch (error) {
            httpResponse(res, statusCode.INTERNAL_SERVER_ERROR, responseStatus.FAILURE, responseMessage.INTERNAL_SERVER_ERROR, error.message);
        }
    }

    // User Forgotten Password Controller
    static async userForgetPassword(req,res){
        try {

            const userData = await User.findOne({ email: req.body.email });
            if(userData){
                if(userData.isVerified == true){
                    const checkPassword = await bcrypt.compare(req.body.password, userData.password);
                    if(!checkPassword){

                        const hashPassword = await bcrypt.hash(req.body.password, 10);
                        const updatedData = await User.findByIdAndUpdate({ _id: userData._id }, {$set: { password: hashPassword }});
                        // console.log(updatedData);
            
                        httpResponse(res, statusCode.OK, responseStatus.SUCCESS, responseMessage.FORGET_PASSWORD_SUCCESS);

                    }else{
                        httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.OLD_PASSWORD_ALERT)
                    } 
                }else{
                    httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.NOT_VERIFIED);
                }
            }else{
                httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.EMAIL_NOT_FOUND);
            }
    
        } catch (error) {
            httpResponse(res, statusCode.INTERNAL_SERVER_ERROR, responseStatus.FAILURE, responseMessage.INTERNAL_SERVER_ERROR, error.message);
        }
    }

    // Reset User Password Controller
    static async userResetPassword(req,res){
        try {
        
            const userId = req.userId;
            const userData = await User.findById({ _id: userId });
            if(userData){
                // console.log(userData);
                const passwordMatch = await bcrypt.compare(req.body.password, userData.password);
                if(!passwordMatch){
                    if(userData.isDeleted == false){

                        const newPassword = await bcrypt.hash(req.body.password, 10);
                        const updatedUserData = await User.findByIdAndUpdate(
                            { _id: userId },
                            { $set: { password: newPassword }}
                        );
                        httpResponse(res, statusCode.OK, responseStatus.SUCCESS, responseMessage.PASSWORD_CHANGE_SUCCESS);
    
                    }else{
                        httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.USER_DELETED);
                    }
                }else{
                    httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.OLD_PASSWORD_ALERT);
                }
            }else{
                httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.UNAUTHORIZED);
            }
        } catch (error) {
            httpResponse(res, statusCode.INTERNAL_SERVER_ERROR, responseStatus.FAILURE, responseMessage.INTERNAL_SERVER_ERROR, error.message);
        }
    }

    // Update User profile Controller
    static async userProfileUpdate(req,res){
        try {
            const userId = req.userId;
            const checkExistingEmail = await User.findOne( { _id: {$ne: userId}, email: req.body.email } );
            if (!checkExistingEmail) {
                const checkExistingPhone = await User.findOne( { _id: {$ne: userId}, phone: req.body.phone } );
                if(!checkExistingPhone){
    
                    const userData = await User.findByIdAndUpdate(
                        { _id: userId },
                        { $set: { name: req.body.name, email: req.body.email, phone: req.body.phone } }
                    );
                    if (userData) {
                        console.log(userData);
                        httpResponse(res, statusCode.OK, responseStatus.SUCCESS, responseMessage.PROFILE_UPDATE);
                    }else{
                        httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.UNAUTHORIZED);
                    }
    
                }else{
                    httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.PHONE_ALREADY_EXIST);
                }
            } else {
                httpResponse(res, statusCode.BAD_REQUEST, responseStatus.FAILURE, responseMessage.EMAIL_ALREADY_EXIST);
            }
        } catch (error) {
            httpResponse(res, statusCode.INTERNAL_SERVER_ERROR, responseStatus.FAILURE, responseMessage.INTERNAL_SERVER_ERROR, error.message);
        }
    }

}


export default UserController;

// httpResponse(res, statusCode.INTERNAL_SERVER_ERROR, responseStatus.FAILURE, responseMessage.INTERNAL_SERVER_ERROR);







