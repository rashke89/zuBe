const jwt = require("jsonwebtoken")
const {JWT_SECRET_KEY} = require("../config/token.config")
const verifyToken = (req, res, next) => {
    if (req.headers.hasOwnProperty("authorization")) {
        let token = req.headers.authorization
        // console.log("JWT decode", jwt.decode(token, JWT_SECRET_KEY))
        // todo: check if user exist in DB
        // if exist call next function
        // else return error
        next()
    } else {
        res.status(210).send("No authorization! You mus login")
    }
}

module.exports = verifyToken