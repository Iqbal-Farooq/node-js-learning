const path=require('path')
const express=require('express')
const bodyParser=require('body-parser')
const adminData=require('./routes/admin')
const shopRoutes=require('./routes/shop')
const expressHbs=require('express-handlebars')
const app=express();
// pug engine
// app.set('view engine','pug');
// app.set('views','views')
app.engine('hbs',expressHbs({layoutsDir:"views/layouts/",defaultLayout:'main-layout',extname:'hbs'}));
app.set('view engine','hbs');
app.set('views','views')
app.use(bodyParser.urlencoded({extend:false}));
app.use(express.static(path.join(__dirname,'public')))

app.use('/admin',adminData.routes);
app.use(shopRoutes);
app.use((req,res,next)=>{
    res.status(404).render('404',{pagetitle:'Not Found!'})
    // res.status(404).sendFile(path.join(__dirname,'views','404.html'))
})

// const server = http.createServer(app);
// server.listen(3000);
app.listen(3000)
