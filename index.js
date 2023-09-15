const { startBot } = require("./app/bot/index");
const mongoose = require("mongoose");
const express = require("express");
const routes = require("./routes/index");
const bodyParser = require("body-parser");

class Application {
  constructor() {
    this.configApp();
    this.setupMongo();
    this.setupserver();
    startBot();
  }

  setupserver() {
    const app = express();
    const PORT = 3000 || process.env.PORT;
    app.listen(PORT, () => {
      console.log("app listen to port " + PORT);
    });
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(routes);
    app.use(express.static("public"));
    app.set("view engine", "ejs");
  }

  setupMongo() {
    mongoose
      .connect(process.env.DB_ADDRESS)
      .then(() => {
        console.log("db connected");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  configApp() {
    require("dotenv").config(__dirname + "./.env");
  }
}

new Application();
