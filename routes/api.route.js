const router = require('express').Router()
const { default: axios } = require('axios')
const { body } = require('express-validator')
const RateReview = require('../models/ratereview.model') 
const Upload = require('../models/upload.model') 
const User = require('../models/user.model') 
const Book = require('../models/book.model') 
const multer = require('multer')
const path = require('path')



const storage = multer.diskStorage({
    destination:"./public/uploads/fort",
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname))
    }
})

const upload = multer({
    storage : storage
}).array('file',8)


router.get("/upload_img",async(req,res,next)=>{
    try 
    {
        email = req.query.email
        //console.log(email+"upload image")
        const image = await Upload.find({guide_name : email})
       // console.log(image)
        if (image)
            res.send(image)
        
        // res.send("ok")
    } catch (error) {
        next(error)
    }
})


router.post('/upload_img',upload,async(req,res,next)=>{
    try
    {
        const upld = new Upload({
            guide_name    :   req.body.guide_name,
            info_local    :   req.body.info_local,
            img_local1    :   req.files[0] && req.files[0].filename ? req.files[0].filename : '',
            img_local2    :   req.files[1] && req.files[1].filename ? req.files[1].filename : '',
            img_local3    :   req.files[2] && req.files[2].filename ? req.files[2].filename : '',
            info_product  :   req.body.info_product,
            img_product1  :   req.files[3] && req.files[3].filename ? req.files[3].filename : '',
            img_product2  :   req.files[4] && req.files[4].filename ? req.files[4].filename : '',
            img_product3  :   req.files[5] && req.files[5].filename ? req.files[5].filename : '',
        })
        await upld.save()
        res.redirect('/user/guide')
    }
    catch(error)
    {
        next(error)
    }
})



router.post("/touristfilleddata",[
    body('review')
        .trim()
],async(req,res,next)=>{
    try 
    {
        //console.log(req.body)
        const guide = req.body
        const ratereview = new RateReview(req.body);
        // console.log(req.User) 
        // console.log(req.query)
        await ratereview.save()
               
        res.redirect('/sites/fort/raigad')
        // res.send("ok")
    } catch (error) {
        next(error)
    }
})








router.get("/touristfilleddata",async(req,res,next)=>{
    try 
    {
        const guide = req.query.email
        const guideemail = req.query.guideemail
        if(guideemail)
        {
            const ratereview = await RateReview.find({guide : guideemail})

            //console.log(ratereview)
            if (ratereview)
                res.send(ratereview)
        }
        else{
           // console.log(guide +'alay')
            const ratereview = await RateReview.find({guide})
    
            //console.log(ratereview)
            if (ratereview)
                res.send(ratereview)
        }
        
        
        // res.send("ok")
    } catch (error) {
        next(error)
    }
})



// router.get("/touristfilleddata/specific",async(req,res,next)=>{
//     try 
//     {
//         guide = req.query.guideemail
//         console.log(guide)
//         const ratereview = await RateReview.find({guide})

//         //console.log(ratereview)
//         if (ratereview)
//             res.send(ratereview)
        
//         // res.send("ok")
//     } catch (error) {
//         next(error)
//     }
// })




router.get("/guidedata",async(req,res,next)=>{
    try 
    {
        fort=req.query.fort
        Username=req.query.email
       // console.log(Username+"guidedata")
        if(Username){
            const user = await User.find({
                $and: [{ role: 'Guide' },{ fort },{Username}]
             })
            //console.log(user)
            if (user)
                res.send(user)
        }
        else
        {
            const user = await User.find({
                $and: [{ role: 'Guide' },{ fort }]
             })
            //console.log(user)
            if (user)
                res.send(user) 
        }
        
        // res.send("ok")
    } catch (error) {
        next(error)
    }
})



router.post("/book",async(req,res,next)=>{
    try 
    {
        // const book = new Book(req.body);
        // console.log(req.User) 
        // console.log(req.query)

        date = req.body.date
        guide = req.body.guide

        // const book = new Book(req.body);
        // await book.save()
        
        const book = await Book.find({
            $and: [{ date },{ guide }]
         })
        //  console.log("Book after")
        //  console.log(book)
        //console.log(ratereview)
        if (book.length===1)
        {
            req.flash('warning',`Guide is already booked for data : ${date}`)
            res.redirect('/sites/fort/raigad')
            return
        }
        else
        {
            const book = new Book(req.body);
            await book.save()
        }
        res.redirect('/sites/fort/raigad')

        // axios.get('http://localhost:3000/api/book',{
        // params: {date: req.body.date,email : req.body.guide}
     // })
    //   .then(function(response) {
    //         console.log(response.data)
    //         if (response.data.length>1) {
    //             req.flash('warning',`Guide is already booked for data : ${response.data[0].date}`)
    //             res.redirect('/sites/fort/raigad')
    //             return
    //         }
    //         else
    //         {
    //             book.save()
    //             res.redirect('/sites/fort/raigad')

    //         }
    //        // res.render("raigad", {guide:response.data})
         

    //     }

    //     ).catch(err => next(err))
        
       // res.redirect('/sites/fort/raigad')
        // res.send("ok")
    } catch (error) {
        next(error)
    }
})


router.get("/book",async(req,res,next)=>{
    try 
    {
        const touristemail = req.query.touristemail
        const guideemail = req.query.guideemail
        const fort = req.query.fort
        const _id = req.query._id
        console.log(req.query)
        if(_id)
        {
            if(req.user.role==='Guide')
            {
                const book = await Book.findByIdAndUpdate(_id,{flag : 1})
                if(book)        
                   res.redirect('/user/book/guide')
            }
            else
            {
                const book = await Book.findByIdAndUpdate(_id,{flag : 1})
                if(book)        
                   res.redirect('/user/book')
            }
        }
        else
        {
            if(guideemail)
            {
                const book = await Book.find({
                    $and: [{ guideemail },{ fort }]
                 })
                 if(book)        
                    res.send(book)
            }
            else
            {
                const book = await Book.find({
                    $and: [{ touristemail },{ fort }]
                 })
                 if(book)        
                    res.send(book)
            }
            
       }
    } catch (error) {
        next(error)
    }
})




// router.get("/book/guide",async(req,res,next)=>{
//     try 
//     {
//         guideemail = req.query.guideemail
//         fort = req.query.fort
//         _id = req.query._id
//         console.log(req.query)
//         if(_id)
//         {
//             const book = await Book.findByIdAndUpdate(_id,{flag : 1})
//              if(book)        
//                 res.redirect('/user/book/guide')
//         }
//         else
//         {
//             const book = await Book.find({
//             $and: [{ guideemail },{ fort }]
//          })
//          if(book)        
//             res.send(book)
//        }
//     } catch (error) {
//         next(error)
//     }
// })





module.exports = router