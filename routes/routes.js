/**
 * Module defining the routes for the Express application.
 * @module routes
 */

const Router = require("express").Router();
const UserDatabase = require("../model/users");
const ArticleDatabase = require("../model/botArticles");

/**
 * GET route for the homepage.
 * @name GET /
 * @function
 * @memberof module:routes
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
Router.get("/", (req, res) => {
  res.render("index");
});

/**
 * GET route for adding an article.
 * @name GET /addArticle
 * @function
 * @memberof module:routes
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
Router.get("/addArticle", (req, res) => {
  res.render("addArticle");
});

/**
 * GET route for fetching user data via API.
 * @name GET /api/users
 * @function
 * @memberof module:routes
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
Router.get("/api/users", async (req, res) => {
  const users = await UserDatabase.find({});
  res.send(users);
});

/**
 * POST route for adding an article via API.
 * @name POST /api/articles
 * @function
 * @memberof module:routes
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
Router.post("/api/articles", async (req, res) => {
  /**
   * Express request body containing article information.
   * @typedef {object} article
   * @property {string} articleTitle - The title of the article.
   * @property {string} articleContent - The content of the article.
   */

  const article = new ArticleDatabase({
    title: req.body.articleTitle,
    caption: req.body.articleContent,
  });
  await article.save();
  res.redirect("/addArticle");
});

// Export the Express Router with defined routes.
module.exports = Router;
