/**
 * Middleware for handling user interactions related to the main menu.
 * @module textMW
 */

// Import necessary modules and buttons.
const { Telegraf, Markup, Scenes } = require("telegraf");
const {
  mainMenuButtonTexts,
  backBotton,
  mainMenuButton,
  suggestionButtons,
  newsLinkButton,
  categoryBotton,
  botArticlesButton,
  roadMapBotton,
} = require("../utils/buttonManager");
const messages = require("../utils/messages");
const chatBot = require("../../API/chatbot");
const getNews = require("../../API/news");
const UserDatabase = require("../../../model/users");
const ArticlesDatabase = require("../../../model/botArticles");

/**
 * Middleware for handling main menu button selections.
 * @param {object} ctx - The Telegraf context object.
 * @param {function} next - The next middleware function.
 */
const mainMenuMiddleWare = (ctx, next) => {
  if (!ctx.message) return next();
  const text = ctx.message.text;
  if (text && Object.values(mainMenuButtonTexts).includes(text)) {
    mainMenuFunctions[text](ctx);
  }
  next();
};

/**
 * Middleware for handling the back button.
 * @param {object} ctx - The Telegraf context object.
 * @param {function} next - The next middleware function.
 */
const backButtonMiddleWare = (ctx, next) => {
  if (!ctx.message) return next();
  const text = ctx.message.text;
  if (text && text == "بازگشت 🔙") {
    ctx.session.articleNumber = undefined;
    ctx.session.newsNumber = undefined;
    ctx.session.state = undefined;
    ctx.reply(messages.choosYourNewOp, mainMenuButton);
  }
  next();
};

/**
 * Define main menu actions and their functionalities.
 * @type {Object}
 */
const mainMenuFunctions = {
  /**
   * Chatbot action.
   * @param {object} ctx - The Telegraf context object.
   */
  [mainMenuButtonTexts.chat]: (ctx) => {
    // Send a greeting message for the chatbot.
    ctx.reply(messages.chatBotMessageGreeting, backBotton);
    // Ask for user input and set the state to "chatbot".
    ctx.reply(messages.chatBotMessageAsk, suggestionButtons);
    ctx.session.state = STATE_LIST.CHATBOT;
  },

  /**
   * News action.
   * @param {object} ctx - The Telegraf context object.
   */
  [mainMenuButtonTexts.news]: async (ctx) => {
    // Set the newsNumber session variable to 0.
    ctx.session.newsNumber = 0;
    // Get the user ID from the update.
    userId = ctx.update.message.from.id;
    // Find the user in the database.
    let user = await UserDatabase.findOne({ id: userId });

    if (user.config) {
      // If the user is configured, fetch and display news articles.
      await getNews(0, user, async ({ title, body, image, link }) => {
        await ctx.replyWithPhoto(
          { url: image },
          {
            caption: `🌐 ${title} \n〰️〰️〰️\n ${body}`,
            ...newsLinkButton(link),
          }
        );
      });
      // Send a back button to return to the main menu.
      ctx.reply("〰️〰️〰️", backBotton);
    } else {
      // If the user is not configured, prompt them to choose a category.
      ctx.reply(messages.choosYourCat, categoryBotton(user));
    }
  },

  /**
   * Bot Articles action.
   * @param {object} ctx - The Telegraf context object.
   */
  [mainMenuButtonTexts.articles]: async (ctx) => {
    // Fetch all bot articles.
    const article = await ArticlesDatabase.find({});
    // Get the index of the last article.
    lastArticleIndex = article.length - 1;
    // Set the articleNumber session variable to the last article index.

    ctx.session.articleNumber = lastArticleIndex;

    // Send a back button to return to the main menu.
    ctx.reply("〰️〰️〰️", backBotton);
    // Display the last article with a photo and caption.
    await ctx.replyWithPhoto(
      {
        url: "https://media.istockphoto.com/id/149303042/photo/futuristic-man.jpg?s=612x612&w=0&k=20&c=9hB6qsugxOUPeoqmAhytBlwXKjR9gBWP0vw527wxD74=",
      },
      {
        caption: `🌐 ${article[lastArticleIndex].title} \n〰️〰️〰️\n ${article[lastArticleIndex].caption}`,
        ...botArticlesButton(),
      }
    );
  },

  /**
   * Roadmap action.
   * @param {object} ctx - The Telegraf context object.
   */
  [mainMenuButtonTexts.roadMap]: async (ctx) => {
    // Send a back button to return to the main menu.
    ctx.reply("〰️〰️〰️", backBotton);
    // Display a message with roadmap options.
    ctx.reply(messages.choosYourCat, roadMapBotton);
  },
};
module.exports = {
  mainMenuMiddleWare,
  backButtonMiddleWare,
};
