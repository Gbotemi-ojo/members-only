const mongoose = require("mongoose");
const {DateTime} = require("luxon")
const Schema = mongoose.Schema;

const message = new Schema({
    user_details: { type: Schema.Types.ObjectId, ref: "sign_up", required: true },
    title: { type: String, required: true, minLength: 3, required: true },
    message: { type: String, required: true, minLength: 8, required: true },
    date_posted : {type:Date}
});

message.virtual("date_formatted").get(function () {
    return DateTime.fromJSDate(this.date_posted).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS);
});
module.exports = mongoose.model("message", message);