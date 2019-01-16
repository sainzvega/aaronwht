const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const quoteSchema = new Schema({
  author: String,
  content: String,
  image: String,
  thumbNail: String,
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "author" }
});

const QuoteClass = mongoose.model("quote", quoteSchema, "quotes");

module.exports = QuoteClass;
