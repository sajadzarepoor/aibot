const Router = require("express").Router();
const UserDatabase = require("../model/users");
const ArticleDatabase = require("../model/botArticles");

Router.get("/", (req, res) => {
  res.render("index");
});

Router.get("/addArticle", (req, res) => {
  res.render("addArticle");
});

Router.get("/api/users", async (req, res) => {
  const users = await UserDatabase.find({});
  res.send(users);
});

Router.post("/api/articles", async (req, res) => {
  const article = new ArticleDatabase({
    title: req.body.articleTitle,
    caption: req.body.articleContent,
  });
  await article.save();
  res.redirect("/addArticle");
});

module.exports = Router;
