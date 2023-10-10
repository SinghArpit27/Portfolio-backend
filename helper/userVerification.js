import nodemailer from 'nodemailer';


// User Verification Email
const sendVerifyMail = async (name, email, otp) => {
    try {

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth:{
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Email Verification OTP',
            html: '<p>Hi ' + name + ', Please verify Your account with OTP <br> <h3> OTP: ' + otp +' </h3>.</p>'
        }
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error);
            }else{
                console.log("Emal has been sent:- ", info.response);
            }
        });

    } catch (error) {
        console.log(error.message);
    }
}

export default sendVerifyMail;