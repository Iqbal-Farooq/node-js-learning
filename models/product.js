const fs = require("fs");
const path = require("path");
const cart=require('./cart')
const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
);
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
    getProductsFromFile((products) => {
      if(this.id){
        console.log('iff',this.id)
        const existingProductIndex=products.findIndex(prod=> prod.id === this.id)
        const updatedProducts=[...products];
        updatedProducts[existingProductIndex]=this
        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          console.log(err);
        });

      }
      else{
        this.id=Math.random().toString()
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err);
        });
      }
      
    });
  }
   
  static deleteProduct(id){
    getProductsFromFile(products=>{
      const prod=products.find(prod=>prod.id ===id)
      const updatedProduct=products.filter(prod=>prod.id !== id);
      fs.writeFile(p,JSON.stringify(updatedProduct),err=>{
        if(!err){
          cart.deleteProduct(id,prod.price)
        }
      })
      // cb(product)
    })
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }
  static getSingleProduct(id,cb){
    getProductsFromFile(products=>{
      const product=products.find(prod=>prod.id ===id)
      cb(product)
    })
  }
};
