const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let toDoSchema = new Schema
({
    item:{type: String, require: true, max: 100},
    done: {type: Boolean, require: true},
});

module.exports = mongoose.model("ToDo", toDoSchema);