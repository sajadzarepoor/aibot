/**
 * Module defining the schema for storing bot articles in the MongoDB database.
 * @module botArticles
 */

const mongoose = require("mongoose");

/**
 * Schema for bot articles.
 * @typedef {Object} BotArticleSchema
 * @property {string} title - The title of the article.
 * @property {string} caption - The caption or description of the article.
 * @property {string} cat - The category of the article.
 * @property {string} pic - The URL of the article's image.
 */

// Define the schema for bot articles.
const schema = new mongoose.Schema({
  title: String,
  caption: String,
  cat: String,
  pic: String,
});

// Export the model for bot articles.
module.exports = mongoose.model("articles", schema);
