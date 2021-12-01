const router = require('express').Router()
const User= require('../models/user.model')
const { body, validationResult } = require('express-validator')
const passport = require('passport')
const { ensureLoggedOut, ensureLoggedIn } = require('connect-ensure-login');
const { route } = require('./index.route');
const multer = require('multer')
const path = require('path')

router.get('/login', 
    ensureLoggedOut({redirectTo:'/'}),
    async (req, res, next) => {
    res.render('login')
}) 


router.post(
    '/login',
    ensureLoggedOut({ redirectTo: '/' }),
    passport.authenticate('local', {
      // successRedirect: '/',
      successReturnToOrRedirect: '/user',
      failureRedirect: '/auth/login',
      failureFlash: true,
    })
  );

router.get('/register',
    ensureLoggedOut({ redirectTo: '/' }),
    async (req, res, next) => {
    res.render('register')
})

router.get('/guide_reg',
    ensureLoggedOut({ redirectTo: '/' }),
    async (req, res, next) => {
    res.render('guide_reg')
})

const storage = multer.diskStorage({
    destination:"./public/uploads",
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname))
    }
})

const upload = multer({
    storage : storage
}).single('file')

router.post(
    '/guide_reg',upload,
    ensureLoggedOut({redirect:'/'}), [
    body('Username')
        .trim()
        .isEmail()
        .withMessage('Email must be a valid email')
        .normalizeEmail()
        .toLowerCase(),
    body('Password')
        .trim()
        .isLength(5)
        .withMessage('Password length short , min 5 character required'),
    body('C_Password').custom((value, { req }) => {
        if (value !== req.body.Password) {
            throw new Error("passowrd do not match")
        }
        return true
    })
], 
async (req, res, next) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            errors.array().forEach(error => {
                req.flash('error', error.msg)
            })
            res.render('guide_reg', {
                Username: req.body.Username,
                messages: req.flash()
            })
            return
        }
        const { Username } = req.body
        const doesExist = await User.findOne({ Username})
        if (doesExist) {
            req.flash('warning','Username already exists')
            res.redirect('/auth/guide_reg')
            return
        }
        const guide = new User({
            Full_name : req.body.Full_name,
            Username : req.body.Username,
            Phone_No : req.body.Phone_No,
            Password : req.body.Password,
            C_Password : req.body.C_Password,
            Addrs : req.body.Addrs,
            age : req.body.age,
            A_no : req.body.A_no,
            Exp : req.body.Exp,
            P_id : req.file.filename,
            Gender : req.body.Gender,
            role : req.body.role,
            fort : req.body.fort,
        })
        await guide.save()
        req.flash('success',
        `${guide.Username} registered succesfully , now you can log in`
        );
        res.redirect('/auth/login')
    }
    catch (error) {
        next(error)
    }
})


router.post('/register',upload,
    ensureLoggedOut({redirect:'/'}), [
    body('Username')
        .trim()
        .isEmail()
        .withMessage('Email must be a valid email')
        .normalizeEmail()
        .toLowerCase(),
    body('Password')
        .trim()
        .isLength(5)
        .withMessage('Password length short , min 5 character required'),
    body('C_Password').custom((value, { req }) => {
        if (value !== req.body.Password) {
            throw new Error("passowrd do not match")
        }
        return true
    })
], 
async (req, res, next) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            errors.array().forEach(error => {
                req.flash('error', error.msg)
            })
            res.render('register', {
                Username: req.body.Username,
                messages: req.flash()
            })
            return
        }
        const { Username } = req.body
        console.log(req.body)
        const doesExist = await User.findOne({ Username})
        if (doesExist) {
            req.flash('warning','Username already exists')
            res.redirect('/auth/register')
            return
        }
        const user = new User({
            Full_name : req.body.Full_name,
            Username : req.body.Username,
            Phone_No : req.body.Phone_No,
            Password : req.body.Password,
            C_Password : req.body.C_Password,
            P_id : req.file.filename,
            Gender : req.body.Gender,
            role : req.body.role,
        })
        // const user = new User(req.body)
        await user.save()
        req.flash('success',
        `${user.Username} registered succesfully , now you can log in`
        );
        res.redirect('/auth/login')
    }
    catch (error) {
        next(error)
    }
})

router.get('/logout',ensureLoggedIn({redirect:'/'}),async (req, res, next) => {
    req.logout()
    res.redirect('/')
})
module.exports = router


