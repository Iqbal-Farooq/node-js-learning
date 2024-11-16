// const fs = require("fs");
// const path = require("path");
const cart=require('./cart')
// const p = path.join(
//   path.dirname(process.mainModule.filename),
//   "data",
//   "products.json"
// );
const db=require('../util/database')
const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      console.error(err);
      cb([]);
      return; 
    }
    let products;
    try {
      products = JSON.parse(fileContent);
    } catch (parseErr) {
      console.error(parseErr);
      products = [];
    }
    cb(products);
  });
};
module.exports = class Product {
  constructor(id,tle,imageUrl,price,description,) {
    this.id=id;
    this.title = tle;
    this.imageUrl=imageUrl;
    this.description=description;
    this.price=price;
  }
  save() {
   return db.execute('INSERT INTO products (title,price,description,imageUrl) values(?,?,?,?)',[this.title,this.price,this.description,this.imageUrl])
  }
   
  static deleteProduct(id){
    // getProductsFromFile(products=>{
    //   const prod=products.find(prod=>prod.id ===id)
    //   const updatedProduct=products.filter(prod=>prod.id !== id);
    //   fs.writeFile(p,JSON.stringify(updatedProduct),err=>{
    //     if(!err){
    //       cart.deleteProduct(id,prod.price)
    //     }
    //   })
    //   // cb(product)
    // })
  }

  static fetchAll(cb) {
    // getProductsFromFile(cb);
    return db.execute('SELECT * FROM products')
  }
  static getSingleProduct(id){
   return db.execute('SELECT * FROM products WHERE products.id = ?',[id])
  }
};
