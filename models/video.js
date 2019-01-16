const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define our model
const videoSchema = new Schema({
  title: String,
  videoUrl: String,
  content: String,
  url: String,
  people: [String],
  publishDate: Date,
  mainVideo: Boolean
});

const VideoClass = mongoose.model("video", videoSchema);

// Export the model
module.exports = VideoClass;
