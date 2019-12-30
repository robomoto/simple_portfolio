var mongoose = require("mongoose");

// SCHEMA SETUP
var projectSchema = new mongoose.Schema({
    name: String,
    link: String,
    shortDesc: String,
    description: String,
    tags: [String],
    created: Date,
    category: String, //blog, project, misc
    display: {type: String, default: "private"}, //public, private
    isPublished: {type: Boolean, default: false}
});

module.exports = mongoose.model("Project", projectSchema);