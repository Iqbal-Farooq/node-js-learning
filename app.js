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

const User = require("./models/user");
const MONGODB_URL = "mongodb://localhost:27017/shop";
const app = express();
const store =new MongoDBStore( {
  uri: MONGODB_URL,
  collection: "sessions",
})
// EJS
app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({ secret: "my secret", resave: false, saveUninitialized: false,store:store })
);

app.use((req, res, next) => {
  
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      console.log('user ',user)
      req.user = user; 
      next();
    })
    .catch((err) => console.log(err));
});


app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRouts);
app.use(ErrorController.get404);

mongoose
  .connect(MONGODB_URL)
  .then(() => {
    User.findOne()
      .then((user) => {
        if (!user) {
          const user = new User({
            name: "John",
            email: "john@gmail.com",
            cart: {
              items: [],
            },
          });
          user.save();
        }
      })
      .catch();

    console.log("connected siuccessfully");
    app.listen(7000);
  })
  .catch((err) => console.log("err", err));
