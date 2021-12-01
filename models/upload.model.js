const mongoose = require('mongoose')
// const createHttpError = require('http-errors')
const UploadSchema = new mongoose.Schema({
    guide_name :
    {
        type : String,
    },
    info_local: {
        type: String,
    },
    img_local1: {
        type : String,
    },
    img_local2: {
        type : String,
    },
    img_local3: {
        type : String,
    },
    info_product: {
        type: String,
    },
    img_product1 : {
        type: String,
    },
    img_product2 : {
        type: String,
    },
    img_product3 : {
        type: String,
    },
})
const Upload = mongoose.model('upload',UploadSchema)

module.exports = Upload
