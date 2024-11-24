const path=require('path')
const express=require('express')
const bodyParser=require('body-parser')
const adminRoutes=require('./routes/admin')
const shopRoutes=require('./routes/shop')
const ErrorController=require('./controllers/404')
const sequelize =require( './util/database')
const Product =require('./models/product')
const User = require('./models/user')
const Cart = require('./models/cart')
const CartItem = require('./models/cart-item')
const Order =require('./models/order')
const OrderedItems=require('./models/order-items')
const app=express();

// EJS
app.set('view engine','ejs');
app.set('views','views')

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')))

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            if (user) {
                req.user = user;
            } else {
                console.error("User not found");
            }
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin',adminRoutes);
app.use(shopRoutes);
app.use(ErrorController.get404)
Product.belongsTo(User,{constrains:true,onDelete:"CASCADE"})
User.hasMany(Product);
User.hasOne(Cart)
Cart.belongsTo(User)
Cart.belongsToMany(Product,{through:CartItem})
Product.belongsToMany(Cart,{through:CartItem})
Order.belongsTo(User)
User.hasMany(Order);
Order.belongsToMany(Product,{through:OrderedItems})
sequelize.sync().then(result => {
    return User.findByPk(1);
}).then(user => {
    if (!user) {
        return User.create({ name: 'Jhon', email: 'jhon@gmail.com' });
    }
    return user;
}).then(user => {
    return user.createCart()
}).then(cart=>{
    console.log('User and Product models are synced with associations.');
    app.listen(7000);
}).catch(err => console.log(err));


