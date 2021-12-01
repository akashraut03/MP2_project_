const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const createHttpError = require('http-errors')

const UserSchema = new mongoose.Schema({
    Full_name: {
        type: String,
        // required: true,
    },
    Username: {
        type: String,
        //required: true,
        lowercase: true,
        unique: true
    },
    Phone_No: {
        type: Number,
        // required: true
    },
    Password: {
        type: String,
        // required: true
    },
    C_Password: {
        type: String,
        // required: true
    },
    Addrs:{
        type : String,
        // required : true  
    },
    age:{
        type : Number ,
      //  required : true
    },
    A_no:{
        type : Number,
        // required : true 
    },
    Exp:{
        type : Number,
        // // required : true 
    },
    P_id:
    {
        type : String,
        // // // required : true 
    }    ,
    Gender:
    {
        type: String,
        //require: true
    },
    role:
    {
        type: String,
    },
    fort:
    {
        type: String,
    }
})

UserSchema.pre('save', async function (next) {
    try {
        if (this.isNew) {
            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(this.Password, salt)
            this.Password = hashPassword
            this.C_Password = hashPassword
            if (this.Username === process.env.ADMIN_EMAIL.toLowerCase()) {
                this.role = roles.admin
            }
        }
        next()
    }
    catch (error) {
        next(error)
    }
})

UserSchema.methods.isValidPassword = async function (Password) {
    try {
        return await bcrypt.compare(Password, this.Password)
    }
    catch (error) {
        throw createHttpError.InternalServerError(error.message)
    }
}
const User = mongoose.model('user', UserSchema)

module.exports = User