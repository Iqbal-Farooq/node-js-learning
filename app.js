const path=require('path')
const express=require('express')
const bodyParser=require('body-parser')
const adminRoutes=require('./routes/admin')
const shopRoutes=require('./routes/shop')
const ErrorController=require('./controllers/404')
// const expressHbs=require('express-handlebars')
const app=express();
// pug engine
// app.set('view engine','pug');
// app.set('views','views')
// expresshandlebars
// app.engine('hbs',expressHbs({layoutsDir:"views/layouts/",defaultLayout:'main-layout',extname:'hbs'}));
// app.set('view engine','hbs');
// app.set('views','views')
// EJS
app.set('view engine','ejs');
app.set('views','views')
app.use(bodyParser.urlencoded({extend:false}));
app.use(express.static(path.join(__dirname,'public')))

app.use('/admin',adminRoutes);
app.use(shopRoutes);
app.use(ErrorController.get404)

// const server = http.createServer(app);
// server.listen(3000);
app.listen(3000)
