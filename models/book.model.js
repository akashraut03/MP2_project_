const mongoose = require('mongoose')
// const createHttpError = require('http-errors')
const BookSchema = new mongoose.Schema({
    tourist: {
        type: String,
    },
    touristemail: {
        type: String,
    },
    guide: {
        type: String,
    },
    date: {
        type: String,
    },
    Addrs:{
        type : String,
    },
    Full_name:{
        type : String,
    },
    Phone_No:{
        type : Number,
    },
    fort:{
        type : String,
    },
    touristNo:{
        type : Number,
    },
    touristgender:{
        type : String,
    },
    flag :
    {
        type : Number,
        default : 0
    }
})
const Book = mongoose.model('Book',BookSchema)

module.exports = Book