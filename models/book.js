const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define our model
const bookSchema = new Schema({
  author: String,
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "author" },
  title: String,
  rating: Number,
  purchaseUrl: String,
  image: String,
  imageHeight: Number,
  imageWidth: Number,
  thumbNail: String,
  thumbNailHeight: Number,
  thumbNailWidth: Number,
  ordinal: Number
});

const BookClass = mongoose.model("book", bookSchema);

// Export the model
module.exports = BookClass;
