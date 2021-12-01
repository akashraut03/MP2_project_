const { default: axios } = require('axios');

const router = require('express').Router()

router.get('/fort', (req, res, next) => {
    res.render('fort');
})

router.get('/fort/raigad', (req, res, next) => {
   axios.get('http://localhost:3000/api/guidedata',{
        params: {fort: 'raigad'}
      }).then(function (response) {
            //console.log(response.data)

        
            res.render("raigad", {guide:response.data})
         

        }

        ).catch(err => next(err))
})


router.get('/fort/raigad/guide_info', (req, res, next) => {

    //console.log(req.query)'
    email=req.query.email
    //guideemail = req.query.guideemail
    axios.all([
      axios.get('http://localhost:3000/api/guidedata',{params: {fort: 'raigad',email}}),
      axios.get('http://localhost:3000/api/touristfilleddata',{ params: {fort: 'raigad',email}}), 
      axios.get('http://localhost:3000/api/upload_img',{ params: {email}})
    ]).then(axios.spread((guideinfo,touristdata,upload_img) => {

      console.log(touristdata.data)

      const totalrating = touristdata.data.reduce(function(pre,cur)
      {
        return pre + cur.rating
      },0)
      console.log(totalrating)
      const averagerating = totalrating / touristdata.data.length 
      

      
          const touristNo = req.user.Phone_No
          const touristgender = req.user.Gender
          //console.log(touristNo,touristgender)
        res.render("guide_info", { tourist:req.user.Full_name,touristemail:req.user.Username,comment:touristdata.data,guideinfo:guideinfo.data,image:upload_img.data,fort : 'raigad' , touristNo , touristgender , averagerating
        })
      }));

    
    
})


// router.get('/fort/raigad/guide_info/guide', (req, res, next) => {

//     //console.log(req.query)'
//     //email=req.query.email
//     guideemail = req.query.guideemail

//     axios.all([
//         axios.get('http://localhost:3000/api/touristfilleddata/specific',{ params: {fort: 'raigad',guideemail}}), 
//         axios.get('http://localhost:3000/api/guidedata'        ,{params: {fort: 'raigad',email}}
//     )])
//       .then(axios.spread((touristdata, guideinfo) => {
//         // Both requests are now complete
//         res.render("guide_info", { tourist:req.user.Full_name,touristemail:req.user.Username,comment:touristdata.data,guideinfo:guideinfo.data
//         })
//         //console.log(obj2.data.login + ' has ' + obj2.data.public_repos + ' public repos on GitHub');
//       }));

//     // axios.get('http://localhost:3000/api/touristfilleddata',{ params: {fort: 'raigad'}}).then(function (response) {
//     //         //console.log(response.data)

        
//     //         res.render("guide_info", { tourist:req.user.Full_name, comment:response.data})
         

//     //     }

//     //     ).catch(err => next(err))
    
// })


module.exports = router