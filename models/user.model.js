 const Mongoose = require('mongoose')

 const userSchema = new Mongoose.Schema({
     email: {
         type: String
     },
     password: {
         type: String
     },
     firstName: {
         type: String
     },
     lastName: {
         type: String
     },
     username: {
         type: String
     },
     address: {
         type: String
     },
     city: {
         type: String
     },
     isAdmin: {
         type: Boolean,
         default: false
     },
     isActive: {
         type: Boolean,
         default: false
     }
 })

 const UserModel = Mongoose.model('users', userSchema)

 module.exports = UserModel