const nodemailer = require("nodemailer");
const {MAIL_USER, MAIL_PASS} = require("../config/mail.config");
const path = require("path");
const transporter = nodemailer.createTransport({
    service: "gmail",
    // host: "smtp.gmail.com",
    // port: 587,
    // secure: false,
    auth: {
        user: MAIL_USER,
        pass: MAIL_PASS
    }
})

/*
* to - String who receive mail
* subject - String subject maile
* message - HTML message
* */
const sendMail = function (to, subject, html) {
    let mailOptions = {
        from: `"ZureaShop" ${MAIL_USER}`, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        html: html, // html body
        attachments: [
            {
                filename: "logo.png",
                path: path.resolve(__dirname, "../public/image/logo.png"),
                cid: 'logo@nodemailer.com'
            }
        ]
    }
    return transporter.sendMail(mailOptions)
}

module.exports = sendMail
