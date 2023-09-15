const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  title: String,
  caption: String,
  cat: String,
  pic: String,
});

module.exports = mongoose.model("articles", schema);
