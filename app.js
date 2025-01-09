const mongoose = require("mongoose");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const ErrorController = require("./controllers/error");
const MongoDBStore = require("connect-mongodb-session")(session);
const authRouts = require("./routes/auth");
const csurf=require('csurf')
const flash=require('connect-flash')
const multer=require('multer')
const User = require("./models/user");
const MONGODB_URL = "mongodb://localhost:27017/shop";
const app = express();
const store =new MongoDBStore( {
  uri: MONGODB_URL,
  collection: "sessions",
})
const csurfProtection=csurf()

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
      const timestamp = Date.now();
      const randomString = Math.random().toString(12).substring(2, 8); 
      const sanitizedFilename = `${timestamp}-${randomString}-${file.originalname}`;
      cb(null, sanitizedFilename);
  },
});
const fileFilter=(req,file,cb)=>{
  if(file.mimetype==='image/png' || file.mimetype==='image/jpg' || file.mimetype==='image/jpeg'){
    cb(null,true)
  }else{
    cb(null,false)
  }
}

// EJS
app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({storage:fileStorage,fileFilter:fileFilter}).single('image'));
app.use(express.static(path.join(__dirname, "public")));
app.use('/images',express.static(path.join(__dirname, "images")));
app.use(
  session({ secret: "my secret", resave: false, saveUninitialized: false,store:store })
);
app.use(csurfProtection)
app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn; 
  res.locals.csrfToken = req.csrfToken(); 
  next();
});
app.use((req, res, next) => {
  
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      // throw new Error('Filed')
      if(!user){
        return next()
      }
    
      req.user = user; 
      next();
    })
    .catch((err) => {
      next(new Error(err))
    });
});



app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRouts);
app.get("/500",ErrorController.get500);
app.use(ErrorController.get404);
app.use((error,req, res, next) => {

  res.status(500).render('500', {
    pageTitle: 'Error',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn
  });
});

mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log("connected siuccessfully");
    app.listen(7000);
  })
  .catch((err) => {
    next(new Error(err))
  });
