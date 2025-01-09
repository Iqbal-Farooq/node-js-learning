// const {  mongoose } = require('mongoose');
const Product = require('../models/product');
const fileHelper =require('../util/file')
exports.getAddProduct = (req, res, next) => {
  
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.file;
  const price = req.body.price;
  const description = req.body.description;
  if(!imageUrl){
    throw  new Error("Invalid FILE")
  }
  const product = new Product({
    // _id:new mongoose.Types.ObjectId('676ba2147d5c97cc4c2be7ba'),
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl.path,
    userId: req.user
  });
  product
    .save()
    .then(result => {
      // console.log(result);
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log('err ----',err)
    const error=new Error(err)
    error.httpStatusCode=500;
    return (next(error))
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        
      });
    })
    .catch(err => {
      const error=new Error(err)
      error.httpStatusCode=500;
      return (next(error))
      });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  // const imageUrl=req.body.imageUrl
  const image = req.file;
  const updatedDesc = req.body.description;

  Product.findById(prodId)
    .then(product => {
      if(product.userId.toString() != req.user._id.toString()){
        return res.redirect('/')
      }

      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      if(image){
        fileHelper.deleteFile(product.imageUrl)
        product.imageUrl = image.path;
      }
    
      return product.save().then(result => {
        console.log('UPDATED PRODUCT!');
        res.redirect('/admin/products');
      })
    })
    
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch(err => {
      const error=new Error(err)
      error.httpStatusCode=500;
      return (next(error))
      });
};


exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findById({_id: prodId}).then(product => {
    if (!product) {
      return next(new Error("Product Not Found"));
    }
    if (product.imageUrl) {
      fileHelper.deleteFile(product.imageUrl);
    }

    return Product.deleteOne({_id: prodId, userId: req.user._id});
  })
  .then(() => {
    res.redirect('/admin/products');
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};

