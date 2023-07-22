const sign_up = require("../models/sign_up");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
require('dotenv').config();

exports.club_form_get = asyncHandler(async (req, res, next) => {
    if (!res.locals.currentUser) return res.redirect("sign_in");
    res.render("club", { user: res.locals.currentUser });
});
exports.club_form_post = [
    body('club_code').custom((value, { req }) => {
        if (value !== process.env.club_passcode) {
            throw new Error("The club code is game6");
        }
        else {
            return true;
        }
    }),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render("club", {
                errors: errors.array(),
                user: res.locals.currentUser
            });
            return;
        }
        else {
            await sign_up.updateOne({ _id: res.locals.currentUser._id }, { $set: { is_club_member: true } });
            res.redirect("/");
        }
    })];