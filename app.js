const path=require('path')
const express=require('express')
const bodyParser=require('body-parser')
const adminRoutes=require('./routes/admin')
const shopRoutes=require('./routes/shop')
const ErrorController=require('./controllers/404')
const sequelize =require( './util/database')

const app=express();

// EJS
app.set('view engine','ejs');
app.set('views','views')

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')))

app.use('/admin',adminRoutes);
app.use(shopRoutes);
app.use(ErrorController.get404)

sequelize.sync().then(result=>{
    // console.log(result)
    app.listen(7000)
}).catch(err=>console.log(err))

