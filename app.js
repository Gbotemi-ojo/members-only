require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require("cookie-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const sign_in_model = require('./models/sign_up');
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
// const bodyParser = require("body-parser")

const usersRouter = require('./routes/users');
const masterRouter = require("./routes/master_route");
const mongoose = require("mongoose");
const app = express();

mongoose.set("strictQuery", false);
const dev_db_url = `mongodb+srv://Gbotemi:O9lnUB2jiQcUPdo2@cluster0.vndnniu.mongodb.net/members_only?retryWrites=true&w=majority`;
const mongoDB = process.env.MONGODB_URI || dev_db_url;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await sign_in_model.findOne({ username: username });
      if (!user) {
        console.log('Incorrect username')
        return done(null, false, { message: "Incorrect username" });
      };
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          return done(null, user)
        } else if (err) {
          return done(null, false, { message: "Incorrect password" })
        }
      });
    } catch (err) {
      return done(err);
    };
  })
);
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await sign_in_model.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  };
});
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});
app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('./uploads', express.static('./uploads'));
app.use('/', masterRouter);
app.use('/users', usersRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`listening at ${port}`);
});
module.exports = app;
