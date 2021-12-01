const mongoose = require('mongoose')
// const createHttpError = require('http-errors')
const RateReviewSchema = new mongoose.Schema({
    tourist: {
        type: String,
    },
    touristemail: {
        type: String,
    },
    guide: {
        type: String,
    },
    rating: {
        type: Number,
    },
    review: {
        type: String,
    },
})
const RateReview = mongoose.model('RateReview',RateReviewSchema)

module.exports = RateReview