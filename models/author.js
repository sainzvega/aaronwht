const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define our model
const authorSchema = new Schema({
  fullName: String,
  firstName: String,
  middleName: String,
  lastName: String,
  image: String,
  imageHeight: Number,
  imageWidth: Number,
  thumbNail: String,
  thumbNailHeight: Number,
  thumbNailWidth: Number
});

const AuthorClass = mongoose.model("author", authorSchema, "authors");

module.exports = AuthorClass;
