const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define our model
const blogSchema = new Schema({
  title: String,
  url: String,
  image: String,
  thumbNail: String,
  content: String,
  files: [String],
  publishDate: Date,
  dateModified: Date,
  isActive: Boolean
});

const BlogClass = mongoose.model("blog", blogSchema);

// Export the model
module.exports = BlogClass;
