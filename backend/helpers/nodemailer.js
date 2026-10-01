const nodemailer = require("nodemailer")



const sendMail = async (subject, toEmail, otpText) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtpout.secureserver.net",
            port: 465,
            secure: true,
            auth: {
                user: process.env.NODEMAILER_EMAIL || '',
                pass: process.env.NODEMAILER_PW || '',
            },
            tls: {
                ciphers: 'SSLv3',
                rejectUnauthorized: true, // Disable if you get a TLS error
            }
        })

        const mailOptions = {
            from: process.env.NODEMAILER_EMAIL || "",
            to: toEmail,
            subject: subject,
            html: `
             <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <div style="margin-bottom: 20px;">
        <h3 style="color:#02b0f0;">MaheshReddy</h3>
      </div>
      <p>
        <strong style="font-size: 18px; color: #007bff;">${otpText}</strong>
      </p>
      <p>
        Please use this code to verify your email. If you didn't request this, you can safely ignore this email.
      </p>
      <footer style="margin-top: 20px; font-size: 14px; color: #777;">
        <p>Thank you</p><br />
        <p>Exceleed Consulting and Technologies</p>
      </footer>
    </div>
            `
        };


        const info = await transporter.sendMail(mailOptions)
        console.log("Email sent success:", info.messageId)
        return true
    } catch (error) {
        console.log("error sent email", error)
        return false

    }
};


module.exports = sendMail;