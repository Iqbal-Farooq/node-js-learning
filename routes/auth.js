const express = require('express');
const {check,body}=require('express-validator')
const authController = require('../controllers/auth');
const User =require ('../models/user')
const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup',authController.getSignup);

router.post('/login',[
    check('email').isEmail().withMessage('Please Enter A Valid Email').normalizeEmail(),
    check('password','Password Should be 5 chars long ').isLength({min:5}).isAlphanumeric().trim(),

],
       authController.postLogin);

router.post('/signup',
    [check('email').isEmail().withMessage('Please Enter A Valid Email').normalizeEmail()
        .custom((value,{req})=>{
          return User.findOne({ email: value })
            .then((userDoc) => {
              if (userDoc) {
            return Promise.reject('Email Already Exists')
              }      
               return true
             })

}),body('password','Password Should be 5 chars long ').isLength({min:5}).isAlphanumeric().trim(),
body('confirmPassword').trim().custom((value,{req})=>{
    if(value !== req.body.password){
        throw new Error('Password Didnt Match')
    }
    return true 
})], authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);
module.exports = router;