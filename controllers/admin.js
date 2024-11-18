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
    // Product.findByPk(prodId).
    req.user.getProducts({where:{id:prodId}}).
    then(products=>{
        const product=products[0]
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
    console.log("req.user:", req.user);
    if (!req.user) {
        return res.status(500).send("User not found in the request.");
    }
    const { title, imageUrl, price, description } = req.body;
    req.user.createProduct({
        title,
        price,
        imageUrl,
        description,
    })
    .then(result => {
        res.redirect('/products');
    })
    .catch(err => console.log(err));
};


exports.postEditProduct =(req,res,next)=>{
    // console.log('idddd',req.body.productId)
    const prodId=req.body.productId;
    const updatedTitle=req.body.title
    const updatedImageUrl=req.body.imageUrl
    const updatedPrice=req.body.price
    const updatedDescription=req.body.description
    Product.findByPk(prodId).then(product=>{
        product.title=updatedTitle;
        product.price=updatedPrice;
        product.description=updatedDescription;
        product.imageUrl=updatedImageUrl;
       return  product.save()
    }).then(response=>{
        res.redirect('/admin/products')
    }).catch(err=>console.log(err))
    
}
exports.postDeleteProduct =(req,res,next)=>{
    // console.log('idddd',req.body.productId)
    const prodId=req.body.productId;
    Product.findByPk(prodId).then(product=>{
       return product.destroy();
    }).then(result =>{
        console.log(result)  
        res.redirect('/admin/products')
    })
   
}


exports.getProducts=(req,res,next)=>{
    // Product.findAll()
    req.user.getProducts().
    then(products=>{
        
        res.render('admin/products',{
           prods:products
           ,pageTitle:"Admin Products",
           path:'/admin/products',
          })
     }).catch(err=>console.log(err))
   
}