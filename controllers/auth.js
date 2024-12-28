require('dotenv').config();
const User = require('../models/user');
const bcrypt=require('bcryptjs')
const nodeMailer=require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const transporter=nodeMailer.createTransport(sendgridTransport({
  auth:{
    api_key:process.env.SEND_GRID
  }
}))
exports.getLogin = (req, res, next) => {
  let message=req.flash('error')
  if(message.length>0){
    messsage=message[0]
  }else{
    message=null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
    error:message
  });
};

exports.getSignup = (req, res, next) => {
  let message=req.flash('error')
  if(message.length>0){
    messsage=message[0]
  }else{
    message=null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
    error:message,
  });
};

exports.postLogin = (req, res, next) => {
  const email=req.body.email;
  const password=req.body.password;
  User.findOne({email:email})
    .then(user => {
      if(!user){
        req.flash('error','Invalid Email or Password')
        res.redirect('/login')
      }
      bcrypt.compare(password,user.password).then(doMatch=>{
        if(doMatch){
          req.session.isLoggedIn = true;
          req.session.user = user;
         return  req.session.save(err => {
            console.log(err);
            res.redirect('/');
          });
        
        }
        req.flash('error','Invalid Email or Password')
        res.redirect('/login')
      }).catch(err=>res.redirect('/login'))
    
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  
  const email=req.body.email;
  const password=req.body.password;
  const confirmPassword=req.body.confirmPassword;
  User.findOne({email:email}).then(userDoc=>{
      if(userDoc){
        req.flash('error','Email Already Exist')
        return res.redirect('/signup')
      }
    return  bcrypt.hash(password,12).then(hashedPassword=>{
      const user= new User({
        email:email,
        password:hashedPassword,
        cart:{item:[]}
      })
      return user.save()
    }).then(result=>{
        console.log('user created ',result)
       res.redirect('/login')
    return  transporter.sendMail({
        to:email,
        from:process.env.FROM_EMAIL,
        subject:"Signup Succeeded",
        html:'<h1>You Successfully SignedUp </h1>',  
      }).catch(err=>{
        console.log('node mailer ',err)
      })
    
    })
    
  }).catch(err=>console.log(err))

};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
