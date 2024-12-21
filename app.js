const mongoose=require("mongoose")
const path=require('path')
const express=require('express')
const bodyParser=require('body-parser')
const adminRoutes=require('./routes/admin')
const shopRoutes=require('./routes/shop')
const ErrorController=require('./controllers/404')

const User =require('./models/user')
const app=express();

// EJS
app.set('view engine','ejs');
app.set('views','views')

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')))

app.use((req, res, next) => {
    User.findById('67664bb24ff07ce5966a18f4')
        .then(user => {
            req.user=user
            
            next();
        })
        .catch(err => console.log(err));
});


app.use('/admin',adminRoutes);
app.use(shopRoutes);
app.use(ErrorController.get404)

mongoose.connect("mongodb://localhost:27017/shop").then(()=>{
    User.findOne().then(user=>{
        if(!user){
            const user= new User({
                name:'John',
                email:"john@gmail.com",
                cart:{
                    items:[]
                }
            })
            user.save();
        }
    }).catch()
    
    console.log('connected siuccessfully')
    app.listen(7000)
}).catch(err=>console.log('err',err))
   


