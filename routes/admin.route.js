const {User,Guide} = require('../models/user.model')

const router = require('express').Router()

router.get('/users',async(req,res,next)=>{
    try
    {
        const users = await User.find()
        const guides = await Guide.find()
        res.send({guides,users})
    }
    catch(error)
    {
        next(error)
    }
})

module.exports = router