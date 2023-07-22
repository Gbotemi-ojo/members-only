const asyncHandler = require("express-async-handler");
const sign_up = require("../models/sign_up");
const fs = require('fs');
const path = require("path");

exports.get_profile_pic_form = asyncHandler(async (req, res, next) => {
    if (!res.locals.currentUser) return res.redirect("sign_in");
    res.render("profile_pic_form", { user: res.locals.currentUser });
});
exports.upload_profile_pic = asyncHandler(async (req, res) => {
    const imageUrl = () => {
        if (req.file === undefined) {
            return "kup"
        }
        else {
            if (!req.file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                res.render("profile_pic_form", {
                    error_msg: "invalid image format,please use either .jpeg , .png, or .jpg"
                })
                return;
            }
            else if (req.file.size > 500000) {
                res.render("profile_pic_form", {
                    error_msg: "file size too large, a maximum of 500kb"
                });
                return;
            }
            else {
                return req.file.filename;
            }
        }
    }
    const previous_image = res.locals.currentUser.image
    const Path = path.join(__dirname,"../public/images/uploads/");
    if(previous_image === 'default_picture'){
        await sign_up.updateOne({ _id: res.locals.currentUser._id }, { $set: { image: imageUrl() } });
        res.redirect("/");
    }
    else{
        fs.unlink(Path + previous_image, (err) => {
            if (err) {
                throw err;
            }
            console.log("Delete File successfully.");
        });
        await sign_up.updateOne({ _id: res.locals.currentUser._id }, { $set: { image: imageUrl() } });
        res.redirect("/");
    }
})