const express = require("express")
const mailRoute = express.Router()
const sendMail = require("../services/mail.service")
const {htmlContactForm} = require("../template/mail.template");

mailRoute.post("/sendContact", (req, res) => {
    const {email, subject, message} = req.body

    let mailHtml = htmlContactForm(message)

    sendMail(email, subject, mailHtml)
        .then((result) => {
            // todo: add in emails DB
            res.send("mail is send")
        })
        .catch((err) => {
            res.status(415).send(err)
        })
})

module.exports = mailRoute