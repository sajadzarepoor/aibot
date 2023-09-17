/**
 * This file is related to the main execution of the application.
 * @module index
 */
// Import necessary modules and dependencies.
const { startBot } = require("./app/bot/startBot");
const mongoose = require("mongoose");
const express = require("express");
const routes = require("./routes/routes");
const bodyParser = require("body-parser");

/**
 * Represents the main application.
 * @class
 */
class Application {
  /**
   * Creates an instance of the Application class.
   * Initializes and sets up the application.
   */
  constructor() {
    this.configApp();
    this.setupMongo();
    this.setupServer();
    startBot();
  }

  /**
   * Configure the application.
   */
  configApp() {
    // Load environment variables from the .env file.
    require("dotenv").config(__dirname + "./.env");
  }

  /**
   * Setup and run the Express server.
   */
  setupServer() {
    const app = express();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log("The app is listening on port " + PORT);
    });

    // Parse URL-encoded bodies and expose them on req.body.
    app.use(bodyParser.urlencoded({ extended: true }));

    // Use the defined routes for handling incoming requests.
    app.use(routes);

    // Serve static files from the 'public' directory.
    app.use(express.static("public"));

    // Set the view engine to EJS for rendering dynamic content.
    app.set("view engine", "ejs");
  }

  /**
   * Setup and connect to the MongoDB database.
   */
  setupMongo() {
    mongoose
      .connect(process.env.DB_ADDRESS)
      .then(() => {
        console.log("Database connected successfully.");
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

// Create an instance of the Application class to start the application.
new Application();
