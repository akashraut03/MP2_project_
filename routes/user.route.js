const router = require('express').Router()
const axios = require('axios')
router.get('/',async(req,res,next)=>{
    // res.render("home")
    try {
        if(req.user.role === "Guide")
        {
            await res.redirect('user/guide')
        }
        else if(req.user.role === "Tourist")
        {
            await res.redirect('/')
        }
        // console.log(req.user)
    } catch (error) {
        next(error)
    }
   
})

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

router.get('/guide', async (req, res, next) => {
    const person = req.user ;
    res.render('guideuser',{person})
})
router.get('/tourist', async (req, res, next) => {
    
    res.render('/')
})


router.get('/book', async (req, res, next) => {
    try
    {
        //res.send(req.user.Username)
        const touristemail = req.user.Username
        axios.get('http://localhost:3000/api/book',{
            params: {fort: 'raigad',touristemail}
          }).then( function (response) {
                //console.log(response.data)
                //const flag = response.data[1].flag
            
                 res.render("booked",{book : response.data})
             
    
            }
    
            ).catch(err => next(err)) 
       
            //await res.render('booked')
    }
    catch(error)
    {
        next(error)
    }
    
})



router.get('/book/guide', async (req, res, next) => {
    try
    {
        //res.send(req.user.Username)
        const guideemail = req.user.Username
        //console.log(guideemail)
        axios.get('http://localhost:3000/api/book',{
            params: {fort: 'raigad',guideemail}
          }).then( function (response) {
                //console.log(response.data)
                //const flag = response.data[0].flag
            
                 res.render("bookedtourist",{book : response.data})
             
    
            }
    
            ).catch(err => next(err)) 
       
            //await res.render('booked')
    }
    catch(error)
    {
        next(error)
    }
    
})

router.get('/review', async (req, res, next) => {
    try
    {
        //res.send(req.user.Username)
        const guideemail = req.user.Username

        console.log(guideemail+'form review')
        axios.get('http://localhost:3000/api/touristfilleddata',{
            params: {guideemail}
          }).then( function (response) {
                console.log(response.data)
                //const flag = response.data[0].flag
            
                 res.render("review",{comment : response.data})
             
    
            }
    
            ).catch(err => next(err)) 
       
            //await res.render('booked')
    }
    catch(error)
    {
        next(error)
    }
    
})


module.exports = router