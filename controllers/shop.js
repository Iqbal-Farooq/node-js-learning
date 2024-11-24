const Product = require("../models/product");
const cart = require("../models/cart");
const Order = require("../models/order");

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
  req.user.getCart().then(cart=>{
    return cart.getProducts().then(products=>{
      res.render("shop/cart", {
        pageTitle: "Your Cart ",
        path: "/cart",
        products: products,
      });
    }).ctach(err=>console.log(err))
  }).catch(err=>console.log(err))
 
};
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let newQuantity = 1;
  let fetchedCart;
  let product;

  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then(product => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postCartDeletProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.getCart().then(cart=>{
    return cart.getProducts({where:{id:prodId}})
  }).then(products=>{
    const product=products[0]
   return  product.cartItem.destroy()
  }).then(()=>res.redirect('/cart')).catch(err=>console.log(err))
  // Product.getSingleProduct(prodId, (product) => {
  //   console.log(prodId);
  //   console.log(product);
  //   cart.deleteProduct(prodId, product.price);
  //   res.redirect("/cart");
  // });
};
exports.postOrder=(req,res,next)=>{
  let fetchedCart;
  req.user.getCart().then(cart=>{
    fetchedCart=cart
    return cart.getProducts()
  }).then(products=>{
   return req.user.createOrder().then(order=>{
    order.addProducts(products.map(product=>{
      product.orderItem={quantity:product.cartItem.quantity}
      return product;
    
    }))
      }).catch(err=>console.log(err))
  }).then(result=>{
   return fetchedCart.setProducts(null)
   
  }).then(result=>{
    res.redirect('/orders')
  }).catch(err=>console.log(err))
}
exports.getOrders = (req, res, next) => {
  req.user.getOrders({include:['products']}).then(orders=>{
    res.render("shop/orders", {
      pageTitle: "Orders ",
      path: "/orders",
      orders:orders
    });
  }).catch(err=>console.log(err))
  
};
// exports.getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     pageTitle: "Check Out ",
//     path: "/checkout",
//   });
// };
