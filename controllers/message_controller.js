const message_model = require("../models/message");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const sign_up = require("../models/sign_up");

exports.message_form_get = asyncHandler(async (req, res, next) => {
    if (!res.locals.currentUser) return res.redirect("sign_in");
    res.render("create_message", { user: res.locals.currentUser });
});
exports.message_form_post = [
    body("title", "username name must be minimum of 3 characters")
        .trim()
        .isLength({ min: 3 }),
    body("message", "empty message box not allowed")
        .trim()
        .isLength({ min: 1 }),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const message = new message_model({
            title: req.body.title,
            message: req.body.message,
            date_posted: new Date(),
            user_details: res.locals.currentUser._id
        });
        if (!errors.isEmpty()) {
            res.render("sign_up", {
                message,
                errors: errors.array()
            });
            return;
        }
        else {
            await message.save();
            res.redirect("/");
        }
    })]
exports.delete_message_post = asyncHandler(async (req, res, next) => {
    await sign_up.findByIdAndRemove(res.locals.currentUser);
    res.redirect("/");
})