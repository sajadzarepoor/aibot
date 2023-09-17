/**
 * Module for starting and configuring the Telegram bot.
 * @module startBot
 */

// Import external modules.
const LocalSession = require("telegraf-session-local");
const { Telegraf, Markup, Scenes } = require("telegraf");

// Import middlewares.
const textmiddleware = require("./middleware/textMW");
const actionMiddleware = require("./middleware/actionMW");
const SessionMiddleware = require("./middleware/SessionMW");

// Import internal modules.
const getNews = require("../API/news");
const { mainMenuButton, newsLinkButton } = require("./utils/buttonManager");
const messages = require("./utils/messages");
const saveUserToDatabase = require("./utils/saveUserToDatabase");

// Initialize the user ID and last saved news link.
let userId = 1455464849;
let lastNewsSavedLink = "";

/**
 * Starts the Telegram bot and sets up its functionality.
 */
function startBot() {
  // Initialize the bot instance.
  const bot = new Telegraf(process.env.BOT_TOKEN);
  bot.launch();

  // Use local session middleware.
  bot.use(new LocalSession({ database: "session.json" }));

  /**
   * Handles the /start command.
   * @param {Object} ctx - The Telegraf context object.
   */
  bot.start((ctx) => {
    // Save user information to the database.
    saveUserToDatabase(ctx);
    // Send a greeting message with the main menu buttons.
    ctx.reply(
      messages.greetingMessage(ctx.message.from.first_name),
      mainMenuButton
    );
  });

  // Apply middlewares.
  bot.use(textmiddleware.backButtonMiddleWare);
  bot.use(SessionMiddleware);
  bot.use(textmiddleware.mainMenuMiddleWare);
  bot.use(actionMiddleware);
}

// Export the startBot function.
module.exports = { startBot };
