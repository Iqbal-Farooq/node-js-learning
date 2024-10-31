const fs = require("fs");
const path = require("path");
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
  constructor(tle,imageUrl,description,price) {
    this.title = tle;
    this.imageUrl=imageUrl;
    this.description=description;
    this.price=price;
  }
  save() {
    getProductsFromFile((products) => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }
};
