const UserModel = require('../models/user.model')
const registerValidation = (req, res, next) => {
    let body = req.body
    if (!body.email || !body.firstName || !body.lastName || !body.password || !body.username) {
        return res.status(412).send('Not valid form.')
    }
    UserModel.findOne({email: body.email}, (error, data) => {
        if (error) {
            console.log(error);
            return res.status(413).send("Error on searching user in DB.")
        }
        if (!data) return next()
        return res.status(414).send(`User with email: ${body.email} already exists.`)
    })
}

module.exports = {
    registerValidation
}