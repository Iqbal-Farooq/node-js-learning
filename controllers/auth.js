require("dotenv").config();
const crypto = require("crypto");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodeMailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const transporter = nodeMailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SEND_GRID,
    },
  })
);
exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    messsage = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
    error: message,
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    messsage = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
    error: message,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid Email or Password");
        res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
          req.flash("error", "Invalid Email or Password");
          res.redirect("/login");
        })
        .catch((err) => res.redirect("/login"));
    })
    .catch((err) => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash("error", "Email Already Exist");
        return res.redirect("/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { item: [] },
          });
          return user.save();
        })
        .then((result) => {
          console.log("user created ", result);
          res.redirect("/login");
          return transporter
            .sendMail({
              to: email,
              from: process.env.FROM_EMAIL,
              subject: "Signup Succeeded",
              html: "<h1>You Successfully SignedUp </h1>",
            })
            .catch((err) => {
              console.log("node mailer ", err);
            });
        });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    messsage = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset",
    isAuthenticated: false,
    error: message,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "User Not Found");
          return res.redirect("/reset");
        }
        (user.resetToken = token),
          (user.resetTokenExpiration = Date.now() + 3600000);
        return user.save();
      })
      .then((result) => {
        res.redirect("/");
        transporter
          .sendMail({
            to: req.body.email,
            from: process.env.FROM_EMAIL,
            subject: "Password Reset",
            html: `<p>You requested a Password Reset </p> 
      <a href='http://localhost:7000/reset/${token}'>Click this link to reset password </a>
      
      `,
          })
          .catch((err) => console.log("cant save token", err));
      })
      .catch((err) => console.log(err));
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return res.redirect("/reset");
      }
      let message = req.flash("error");
      if (message.length > 0) {
        messsage = message;
      } else {
        message = null;
      }
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "Set New Password",
        error: message,
        userId: user._id.toString(),
        passwordToken:token
      });
    })
    .catch((err) => console.log(err));
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let updatedUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      if (!user) {
        return res.send('User not found or token expired');
      }
      updatedUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      updatedUser.password = hashedPassword;
      updatedUser.resetToken = undefined;
      updatedUser.resetTokenExpiration = undefined;
      return updatedUser.save();
    })
    .then((result) => {
      res.redirect('/login');
    })
    .catch((err) => {
      console.error(err);
    
    });
};


