const Product=require("../models/product")


exports.getProducts=(req,res,next)=>{
   Product.fetchAll((products)=>{
    res.render('shop/productlist',{
        prods:products,pageTitle:"ALL Products",
        path:'/products',
       })
    
   })
    
}

exports.getIndex=(req,res,next)=>{
    Product.fetchAll((products)=>{
     res.render('shop/index',{prods:products,pageTitle:"shop",
         path:'/',})
     
    })
     
 }
exports.getCart=(req,res,next)=>{
     res.render('shop/cart',{
        pageTitle:"Your Cart ",
         path:'/cart',
        })
   
 }
exports.getOrders=(req,res,next)=>{
     res.render('shop/orders',{
        pageTitle:"Orders ",
         path:'/orders',
        })
   
 }
exports.getCheckout=(req,res,next)=>{
   
     res.render('shop/checkout',{
        pageTitle:"Check Out ",
         path:'/checkout',
        })
     
   
     
 }