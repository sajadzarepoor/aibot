const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: String,
  username: String,
  id: Number,
  type: Array,
  cat: Array,
  config: Boolean,
});

module.exports = mongoose.model("users", schema);
