/**
 * Module defining the schema for storing user data in the MongoDB database.
 * @module users
 */

const mongoose = require("mongoose");

/**
 * Schema for user data.
 * @typedef {Object} UserDataSchema
 * @property {string} name - The name of the user.
 * @property {string} username - The username of the user in telegram.
 * @property {number} id - Telegram ID of the user.
 * @property {Array.<string>} type - Type of content users choose.
 * @property {Array.<string>} cat - An array of user content categories.
 * @property {boolean} config - Indicates if user configuration is set.
 */

// Define the schema for user data.
const schema = new mongoose.Schema({
  name: String,
  username: String,
  id: Number,
  type: Array,
  cat: Array,
  config: Boolean,
});

// Export the model for user data.
module.exports = mongoose.model("users", schema);
