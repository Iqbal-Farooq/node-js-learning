const Product = require('../models/product');
const ITEMS_PER_PAGE= 1;
let totalItems;
exports.getProducts = (req, res, next) => {
  // Product.find()
  //   .then(products => {
      // res.render('shop/product-list', {
      //   prods: products,
      //   pageTitle: 'All Products',
      //   path: '/products',
  //     });
  //   })

  const page=+req.query.page || 1;
  Product.find().countDocuments().then(numProducts=>{
    totalItems=numProducts;
    return   Product.find().skip((page-1)*ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)
  }).then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
        currentPage:page,
        hasNextpage:ITEMS_PER_PAGE * page < totalItems,
        hasPrevious:page>1,
        nextPage: page+1,
        previousPage: page-1,
        lastPage:Math.ceil(totalItems/ITEMS_PER_PAGE)
      });
    })
    .catch(err => {
      const error=new Error(err)
      error.httpStatusCode=500;
      return (next(error))
      });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products',
      });
    })
    .catch(err => {
      const error=new Error(err)
      error.httpStatusCode=500;
      return (next(error))
      });
};

exports.getIndex = (req, res, next) => {
  const page=+req.query.page || 1;
  Product.find().countDocuments().then(numProducts=>{
    totalItems=numProducts;
    return   Product.find().skip((page-1)*ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)
  }).then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        currentPage:page,
        hasNextpage:ITEMS_PER_PAGE * page < totalItems,
        hasPrevious:page>1,
        nextPage: page+1,
        previousPage: page-1,
        lastPage:Math.ceil(totalItems/ITEMS_PER_PAGE)
      });
    })
    .catch(err => {
      const error=new Error(err)
      error.httpStatusCode=500;
      return (next(error))
      });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      
      const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
        
      });
    })
    .catch(err => {
      const error=new Error(err)
      error.httpStatusCode=500;
      return (next(error))
      });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      
      res.redirect('/cart');
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => {
      const error=new Error(err)
      error.httpStatusCode=500;
      return (next(error))
      });
};


