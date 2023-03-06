const express = require('express')
const UserModel = require("../models/user.model");
const authRoute = express.Router()
const userValidation = require('../validation/userValidation')
const sendMail = require('../services/mail.service')
const mailTemplates = require('../template/mail.template')
const jwt = require("jsonwebtoken")
const {JWT_SECRET_KEY} = require("../config/token.config")

authRoute.post('/login', (req, res) => {
    console.log('body...', req.body);
    if (!req.body.email || !req.body.password) {
        res.status(409).send(`Required field: ${!req.body.email ? "email" : "password"}`)
    }
    UserModel.findOne(req.body)
        .then(data => {
            console.log('data...', data);
            // if user not exists in DB
            if (!data) {
                return res.status(215).send('Bad credentials.')
            }
            if (!data.isActive) {
                return res.status(215).send('Not active user')
            }
            // user exists in DB
            let ts = new Date().getTime()
            let token = jwt.sign({...data, ts}, JWT_SECRET_KEY)
            data.password = null
            res.status(200).send({
                user: data,
                token
            })
        })
        .catch(error => {
            console.log(error);
            res.status(415).send(error)
        })
})

authRoute.post(
    '/register',
    userValidation.registerValidation,
    async (req, res) => {
        try {
            const newUser = await UserModel.create(req.body)
            newUser.save()
            const activationMailHtml = mailTemplates.htmlActivation(`http://localhost:3000/activate-account/${newUser?._id}`)

            sendMail(
                newUser?.email,
                'Activation Account',
                activationMailHtml
            )
                .then(() => res.send('User registered.'))
                .catch(error => res.status(415).send(error))
        } catch (e) {
            res.status(416).send(`Error while creating new user: ${req.body.username}`)
        }
    })

module.exports = authRoute;