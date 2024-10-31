const fs=require('fs')
const path=require('path')
const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');
const getProductsFromFile=cb=>{
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
                products = []; // Return an empty array on parse error
            }
            cb(products)
        });
}
module.exports=class Product{
    constructor(tle){
        this.title=tle
    }
    save(){
        getProductsFromFile(products=>{
            products.push(this)
            fs.writeFile(p,JSON.stringify(products),(err)=>{
                console.log(err)
            })
        });
       
       
    }
    
    static fetchAll(cb) {
        getProductsFromFile(cb)
    }
}