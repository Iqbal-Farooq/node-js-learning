const Product = require("../models/product");
const cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((product) => {
      // console.log(product)
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
  //    Product.findAll({where:{id:prodId}}).then((product)=>{
  //       res.render('shop/product-detail',{
  //          product:product[0],
  //          pageTitle:product[0].title,
  //          path:'/products'})

  // }).catch()
  Product.findByPk(prodId)
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
  Product.findAll()
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
  cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(
          (prod) => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render("shop/cart", {
        pageTitle: "Your Cart ",
        path: "/cart",
        products: cartProducts,
      });
    });
  });
};
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.getSingleProduct(prodId, (product) => {
    cart.addProduct(prodId, product.price);
  });
  res.redirect("/cart");
};
exports.postCartDeletProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.getSingleProduct(prodId, (product) => {
    console.log(prodId);
    console.log(product);
    cart.deleteProduct(prodId, product.price);
    res.redirect("/cart");
  });
};
exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    pageTitle: "Orders ",
    path: "/orders",
  });
};
exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Check Out ",
    path: "/checkout",
  });
};
