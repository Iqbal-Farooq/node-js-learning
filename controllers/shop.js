const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((product) => {
      res.render("shop/productlist", {
        prods: product,
        pageTitle: "ALL Products",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((product) => {
      res.render("shop/index", {
        prods: product,
        pageTitle: "shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};
exports.getCart = (req, res, next) => {
  req.user.populate('cart.items.productId').then(user=>{
    const products=user.cart.items
      res.render("shop/cart", {
        pageTitle: "Your Cart ",
        path: "/cart",
        products: products,
      });
    }).catch(err=>console.log(err))
 
};
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId).then(product=>{
     req.user.addToCart(product)
   
  }).then(resut=>{
    console.log(resut)
    res.redirect('/cart')
  }).catch(err=>console.log(err))
  
};

exports.postCartDeletProduct = (req, res, next) => {
  const prodId = req.body.productId;
  console.log('Product ID to delete:', prodId);
  req.user.removeFromCart(prodId).then(result=>{
    console.log(result)
    res.redirect('/cart')
  }).catch(err=>console.log(err))
  
};
