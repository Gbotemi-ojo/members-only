const sign_up_model = require("../models/sign_up");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

exports.sign_up_form_get = asyncHandler(async (req, res, next) => {
    res.render("sign_up");
});

exports.sign_up_form_post = [
    body("username", "username name must be minimum of 3 characters")
        .trim()
        .isLength({ min: 3 })
        .escape(),
    body("password", "password must be at least 8 characters long")
        .trim()
        .isLength({ min: 8 })
        .escape(),
    body('confirm_password').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('password did not match');
        }
        else {
            // return true
            return value === req.body.password;
        }
    }),
    asyncHandler(async (req, res, next) => {
        try {
             // for rerendering form with previous details
            const unhashedDetails = {
                username: req.body.username,
                password: req.body.password,
                confirm_password: req.body.confirm_password
            }
            bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
                const errors = validationResult(req);
                const imageUrl = () => {
                    if (req.file === undefined) {
                        return "default_picture"
                    }
                    else {
                        if (!req.file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                            res.render("sign_up",{
                                error_msg : "invalid image format,please use either .jpeg , .png, or .jpg"
                            })
                        }
                        else if(req.file.size > 500000){
                            res.render("sign_up", {
                                error_msg: "file size too large, a maximum of 500kb"
                            }) 
                        }
                        else{
                            return req.file.filename
                        }
                    }
                }
                const sign_up = new sign_up_model({
                    username: req.body.username,
                    password: hashedPassword,
                    confirm_password: hashedPassword,
                    is_admin: false,
                    is_club_member: false,
                    image: imageUrl()
                });
                if (!errors.isEmpty()) {
                    res.render("sign_up", {
                        sign_up: unhashedDetails,
                        errors: errors.array()
                    });
                    return;
                }
                else {
                    const user_exists = await sign_up_model.findOne({ username: req.body.username })
                    if (user_exists) {
                        res.render("sign_up", {
                            sign_up,
                            error_msg: 'A user with this username exists already'
                        });
                        return;
                    }
                    else {
                        await sign_up.save();
                        res.redirect("/");
                    }
                }
            });
        } catch (error) {
            console.log(error)
        }
    })]

