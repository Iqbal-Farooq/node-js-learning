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

const User = require("./models/user");
const MONGODB_URL = "mongodb://localhost:27017/shop";
const app = express();
const store =new MongoDBStore( {
  uri: MONGODB_URL,
  collection: "sessions",
})
const csurfProtection=csurf()
// EJS
app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
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
