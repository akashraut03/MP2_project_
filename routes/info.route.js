const router = require('express').Router()
const axios = require('axios')

router.get('/guide_info', (req, res, next) => {

    axios.get('http://localhost:3000/api/touristfilleddata',{ params: {fort: 'raigad'}}).then(function (response) {
            //console.log(response.data)

        
            res.render("guide_info", { tourist:req.user.Full_name, comment:response.data})
         

        }

        ).catch(err => next(err))
    
})

module.exports = router