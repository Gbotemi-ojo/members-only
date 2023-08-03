const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sign_up = new Schema({
    username: { type: String, minLength: 3, maxLength: 50 },
    password: { type: String },
    confirm_password: { type: String, required : true },
    image: { type: String, default: 'default_picture', data: Buffer, contentType: String },
    is_admin : {type: Boolean},
    is_club_member : {type:Boolean}
});



module.exports = mongoose.model("sign_up", sign_up);