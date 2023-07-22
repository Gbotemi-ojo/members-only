const sign_up = require("../models/sign_up");
require('dotenv').config();
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.admin_form_get = asyncHandler(async (req, res, next) => {
    if (!res.locals.currentUser) return res.redirect("sign_in");
    // console.log(res.locals.currentUser)
    res.render("admin_form", { user: res.locals.currentUser });
});

exports.admin_form_post = [
    body('admin_passcode').custom((value, { req }) => {
        if (value !== process.env.admin_passcode) {
            throw new Error("incorrect admin password");
        }
        else {
            return true;
        }
    }),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render("admin_form", {
                errors: errors.array(),
                user: res.locals.currentUser
            });
            return;
        }
        else {
            await sign_up.updateOne({ _id: res.locals.currentUser._id }, { $set: { is_admin: true } });
            res.redirect("/");
        }
    })]

