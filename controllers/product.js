const Product=require("../models/product")
exports.getAddProduct=(req,res,next)=>{
    res.render('add-product',{pageTitle:"Add New Products",path:'admin/add-product',productCSS:true,formCSS:true,activeProduct:true})
    // res.sendFile(path.join(__dirname,'..','views','add-product.html'))
}
exports.postAddProducts =(req,res,next)=>{
    const product=new Product(req.body.title)
    product.save()
    res.redirect('/')
}

exports.getProducts=(req,res,next)=>{
   Product.fetchAll((products)=>{
    console.log('prod',products)
    res.render('shop',{prods:products,pageTitle:"shop",hasProds:products.length>0,activeShop:true,productCSS:true})
    // res.sendFile(path.join(__dirname,'..','views','shop.html'))
   })
    
}