const sendMail = require("./nodemailer");


async function sendVerificationEmail(email, username, verifyCode) {
    try {
        await sendMail("Mystery Message Verification Code", //subject of the sendmail params
            email, // email of the sendmail params
            `Hi ${username}, </br/>
      Here's your verification code: ${verifyCode}` // otptext os the send mail params
        )
        return { success: true, message: "Verfication email sends successfully" };
    } catch (emailError) {
        console.error("Error sending verfication email", emailError);
        return { success: false, message: "Failed to send the verfication email" };
    }
}

module.exports = sendVerificationEmail