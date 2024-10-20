const path=require('path')
const express=require('express')
const { title } = require('process')
const router=express.Router()
const products=[]
router.get('/add-product',(req,res,next)=>{
    res.render('add-product',{pageTitle:"Add New Products",path:'admin/add-product',productCSS:true,formCSS:true,activeProduct:true})
    // res.sendFile(path.join(__dirname,'..','views','add-product.html'))
})
router.post('/add-product',(req,res,next)=>{
    products.push({title:req.body.title})
    res.redirect('/')
})
exports.routes=router
exports.products=products