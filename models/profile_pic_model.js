const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const profile_pic = new Schema({
    // image: {
    //     data: Buffer,
    //     contentType: String
    // }
    image: {
        type: String
    }
});

module.exports = mongoose.model("profile_pic", profile_pic);