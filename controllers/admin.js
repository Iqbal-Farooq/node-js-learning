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
    Product.getSingleProduct(prodId,product=>{
        if(!product){
            return res.redirect('/')
        }
        res.render('admin/edit-product',{
            pageTitle:"Edit Product",
            path:'/admin/edit-product',
            editing:editMode,
            product:product
           })
    })
   
    
}
exports.postAddProducts =(req,res,next)=>{
    const title=req.body.title
    const imageUrl=req.body.imageUrl
    const price=req.body.price
    const description=req.body.description
   Product.create({
    title:title,
    price:price,
    imageUrl:imageUrl,
    description:description
   }).then(result=>{
    console.log('created product')
   }).catch(err=>console.log(err))

}

exports.postEditProduct =(req,res,next)=>{
    // console.log('idddd',req.body.productId)
    const prodId=req.body.productId;
    const updatedTitle=req.body.title
    const updatedImageUrl=req.body.imageUrl
    const updatedPrice=req.body.price
    const updatedDescription=req.body.description
    const updatedProduct=new Product(prodId,updatedTitle,updatedImageUrl,updatedPrice,updatedDescription)
    updatedProduct.save()
    res.redirect('/admin/products')
}
exports.postDeleteProduct =(req,res,next)=>{
    // console.log('idddd',req.body.productId)
    const prodId=req.body.productId;
    Product.deleteProduct(prodId)
    console.log('prod id',prodId)
   
    res.redirect('/admin/products')
}


exports.getProducts=(req,res,next)=>{
    Product.findAll().then((products)=>{
        res.render('admin/products',{
           prods:products
           ,pageTitle:"Admin Products",
           path:'/admin/products',
          })
     }).catch(err=>console.log(err))
   
}