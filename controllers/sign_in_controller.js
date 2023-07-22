const asyncHandler = require("express-async-handler");
const passport = require("passport");
const create_message = require("../models/message");

exports.sign_in_form_get = asyncHandler(async (req, res, next) => {
    if (res.locals.currentUser) return res.redirect("/");
    res.render("sign_in");
});

exports.index = asyncHandler(async (req, res, next) => {
    const messages = await create_message.find().populate("user_details").exec()
    res.render("index", { user: res.locals.currentUser,messages })
});

exports.sign_in_form_post = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/sign_up",
});
exports.sign_out = (req,res,next)=>{
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
}