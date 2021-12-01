const router = require('express').Router()

router.get('/post', (req, res, next) => {
    res.render('post');
})

module.exports = router