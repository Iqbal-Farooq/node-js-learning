
const Product=require("../models/product")
exports.getAddProduct=(req,res,next)=>{
    res.render('admin/edit-product',{
        pageTitle:"Add New Products",
        path:'/admin/add-product',
        editing:false,
    })
    
}
exports.getEditProduct=(req,res,next)=>{
    const editMode=req.query.edit;
    if(!editMode){
       return  res.redirect('/');
    }
    const prodId=req.params.productId
   
    Product.findById(prodId).
    then(product=>{
        if(!product){
            return res.redirect('/')
        }
        res.render('admin/edit-product',{
            pageTitle:"Edit Product",
            path:'/admin/edit-product',
            editing:editMode,
            product:product
           })
    }).catch(err=>console.log(err))
   
    
}
exports.postAddProducts = (req, res, next) => {
    const { title, imageUrl, price, description } = req.body;
    const product =new Product({
        title:title,
        imageUrl:imageUrl,
        price:price,
        description:description,
        userId:req.user
    })
    product.save().then(result=>{
        
        res.redirect('/admin/products');
    }).catch(err=>{
        console.log(err)
    })
};


exports.postEditProduct =(req,res,next)=>{
    const prodId=req.body.productId;
    const updatedTitle=req.body.title
    const updatedImageUrl=req.body.imageUrl
    const updatedPrice=req.body.price
    const updatedDescription=req.body.description
    Product.findById(prodId).then(product=>{
        product.title=updatedTitle;
        product.price=updatedPrice;
        product.imageUrl=updatedImageUrl;
        product.description=updatedDescription;
        return product.save().then(result=>{
            console.log('saved =>',result)
            res.redirect('/admin/products')
        }).catch(err=>console.log(err))
    }).catch(err=>console.log(err))    
}
exports.postDeleteProduct =(req,res,next)=>{
    const prodId=req.body.productId;
    Product.findByIdAndDelete(prodId).then(result =>{
        res.redirect('/admin/products')
    }).catch(err=>console.log(err))
   
}


exports.getProducts=(req,res,next)=>{

    Product.find().populate('userId').
    then(products=>{
        res.render('admin/products',{
           prods:products
           ,pageTitle:"Admin Products",
           path:'/admin/products',
          })
     }).catch(err=>console.log(err))
   
}