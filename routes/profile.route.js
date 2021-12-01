const router = require('express').Router()

router.get('/profile', async (req, res, next) => {
    try
    {
        
        if(req.user.role==='Tourist')
        {
            const person = req.user ;
            await res.render('profile',{person})
        }
    }
    catch(error)
    {
        next(error)
    }
    
})

module.exports = router
// const router = require('express').Router()

// router.get('/profile', (req, res, next) => {
//     person = req.user
//     res.render('profile',{person});
// })

// module.exports = router