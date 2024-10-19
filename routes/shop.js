const path=require('path')
const express=require('express')
const router=express.Router()
const adminData=require('./admin')
router.get('/',(req,res,next)=>{
    const products=adminData.products
    res.render('shop',{prods:products,docTitle:"shop"})
    // res.sendFile(path.join(__dirname,'..','views','shop.html'))
})
module.exports = router