const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sign_in = new Schema({
    username: { type: String, required: true, minLength: 3},
    password: { type: String, required: true ,minLength: 8 },
});
module.exports = mongoose.model("sign_in", sign_in);