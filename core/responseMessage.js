export const responseMessage = {

    // Register Response Message
    EMAIL_ALREADY_EXIST: "Email already exists",
    PHONE_ALREADY_EXIST: "Phone already exists",
    REGISTRATION_SUCCESS: "Registration Successfully done, OTP has been sent to your registered email address. Please verify the OTP",
    REGISTRATION_FAILED: "Registration Failed Please try again",

    // OTP Verification
    EMAIL_NOT_FOUND: "Email Not Found",
    INVALID_OTP: "Invalid OTP",
    OTP_EXPIRED: "OTP Expired",
    ALREADY_VERIFIED: "Already Verified",
    OTP_VERIFIED_SUCCESSFULLY: "Email Verify Successfully",
    OTP_SEND:"OTP Send Successfully",


    // Login Response Message
    INCORRECT_CREDENTIALS: "Incorrect Credentials",
    LOGIN_SUCCESS: "Login Successfully",
    USER_DELETED: "Your Account is Deleted",
    NOT_VERIFIED: "Email not verified, Please verify email",

    // Password Response Message
    FORGET_PASSWORD_SUCCESS: "Password Forget Successfully",
    OLD_PASSWORD_ALERT: "can't use old password, please enter new one",
    PASSWORD_CHANGE_SUCCESS: "Password changed successfully",

    // Profile Update
    PROFILE_UPDATE: "Profile updated successfully",

    // Add Projects 
    PROJECT_ADDED:"Project Added Successfully",

    // Add technical Skills
    TECHNICAL_SKILLS_ADDED: "Added Technical Skill",

    // Add Experience
    EXPERIENCE_ADDED:"Experience Added Successfully",

    SUCCESS: 'Success',
    CREATED: 'Resource created successfully',
    BAD_REQUEST: 'Bad request',
    NOT_FOUND: 'Resource not found',
    INTERNAL_SERVER_ERROR: 'Internal server error',
    UNAUTHORIZED: 'Unauthorized User',
    MANUAL_ERR: "ARPIT",
};

export const responseStatus = {
    SUCCESS: 1,
    FAILURE: 0,
};
export const statusCode = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    UNAUTHORIZED: 401,
};