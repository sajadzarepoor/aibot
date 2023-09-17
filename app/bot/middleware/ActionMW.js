/**
 * Middleware for handling various actions in telegram bot.
 * @module actionMW
 */
// Import required modules and dependencies.
const chatBot = require("../../API/chatbot");
const getNews = require("../../API/news");
const {
  newsLinkButton,
  categoryButton,
  newsTypeButton,
  botArticlesButton,
} = require("../utils/buttonManager");
const UserDatabase = require("../../../model/users");
const ArticlesDatabase = require("../../../model/botArticles");
const messages = require("../utils/messages");

/**
 * Object that maps action names to their corresponding regular expressions.
 * @const {Object}
 */
const actionMap = {
  SUG: /^SUG_/,
  NEWS: /^NEWS_\w+/,
  CAT: /^CAT_/,
  TYPE: /^TYPE_/,
  ARTICLE: /^ARTICLE_/,
  ROAD: /^ROAD_/,
};

/**
 * Middleware for handling various actions.
 * @param {Object} ctx - The Telegraf context object.
 * @param {Function} next - The next function to continue the middleware chain.
 */
const actionMiddleware = (ctx, next) => {
  if (!ctx.update.callback_query) return next();
  const dataAction = ctx.update.callback_query.data;

  if (dataAction) {
    const actionValues = Object.values(actionMap);

    for (let i = 0; i < actionValues.length; i++) {
      const isDataActionExist = dataAction.match(actionValues[i]);

      if (isDataActionExist) {
        actionFunctions[Object.keys(actionMap)[i]](ctx, dataAction);
      }
    }
  }
  next();
};

/**
 * Object containing functions for different actions.
 * @const {Object}
 */
const actionFunctions = {
  // Suggestion action
  SUG: async (ctx, dataAction) => {
    const text = dataAction.split("_")[1];

    const typing = await ctx.reply("در حال تایپ کردن ...");
    ctx.sendChatAction("typing");
    const dotsInterval = setInterval(() => {
      ctx.sendChatAction("typing");
    }, 5000);

    await chatBot(text, (res) => {
      ctx.deleteMessage(typing.message_id);
      clearInterval(dotsInterval);
      if (res) {
        ctx.reply(`${res}`);
      }
    });
  },

  // Next and previous for news
  NEWS: async (ctx, dataAction) => {
    const userId = ctx.update.callback_query.from.id;
    let user = await UserDatabase.findOne({ id: userId });
    const text = dataAction.split("_")[1];

    if (text == "NEXT") {
      ctx.session.newsNumber--;
      if (ctx.session.newsNumber < 0) {
        ctx.session.newsNumber = 0;
        ctx.reply("اخبار جدیدتری موجود نیست");
        return;
      }

      await getNews(
        ctx.session.newsNumber,
        user,
        async ({ title, body, image, link }) => {
          await ctx.replyWithPhoto(
            { url: image },
            {
              caption: `🌐 ${title} \n〰️〰️〰️\n ${body}`,
              ...newsLinkButton(link),
            }
          );
        }
      );
    } else if (text == "PRE") {
      ctx.session.newsNumber++;
      if (ctx.session.newsNumber > 9) {
        ctx.reply("اخبار قدیمی‌تری موجود نیست");
        ctx.session.newsNumber = 9;
        return;
      }
      await getNews(
        ctx.session.newsNumber,
        user,
        async ({ title, body, image, link }) => {
          await ctx.replyWithPhoto(
            { url: image },
            {
              caption: `🌐 ${title} \n〰️〰️〰️\n ${body}`,
              ...newsLinkButton(link),
            }
          );
        }
      );
    }
  },

  // NEWS category config
  CAT: async (ctx, dataAction) => {
    let text = dataAction.split("_");
    const userId = ctx.update.callback_query.from.id;
    let user = await UserDatabase.findOne({ id: userId });

    if (text.length > 1) {
      text = text.slice(1).join("_");
    }
    // Next button
    if (text == "NEXT") {
      ctx.editMessageText(
        "چه مطالبی را دوست دارید دریافت کنید ؟",
        newsTypeButton(user)
      );
      return;
    }
    // Add category to database
    if (!user.cat.includes(text)) {
      user.cat.push(text);
      //
      ctx.telegram.editMessageReplyMarkup(
        ctx.update.callback_query.message.chat.id,
        ctx.update.callback_query.message.message_id,
        undefined,
        categoryButton(user).reply_markup
      );
      //
    } else {
      user.cat = user.cat.filter((item) => item != text);
      //
      ctx.telegram.editMessageReplyMarkup(
        ctx.update.callback_query.message.chat.id,
        ctx.update.callback_query.message.message_id,
        undefined,
        categoryButton(user).reply_markup
      );
      //
    }
    await user.save();
  },

  // NEWS type config
  TYPE: async (ctx, dataAction) => {
    let text = await dataAction.split("_")[1];
    const userId = ctx.update.callback_query.from.id;
    let user = await UserDatabase.findOne({ id: userId });

    if (text == "submit") {
      await UserDatabase.updateOne({ id: userId }, { $set: { config: true } });
      return ctx.editMessageText(
        "تنظیمات شما با موفقیت ثبت شد ✅\nلطفاً مجدداً روی دکمه اخبار کلیک کنید"
      );
    }

    // Add type to database
    if (!user.type.includes(text)) {
      user.type.push(text);

      ctx.telegram.editMessageReplyMarkup(
        ctx.update.callback_query.message.chat.id,
        ctx.update.callback_query.message.message_id,
        undefined,
        newsTypeButton(user).reply_markup
      );
    } else {
      user.type = user.type.filter((item) => item != text);

      ctx.telegram.editMessageReplyMarkup(
        ctx.update.callback_query.message.chat.id,
        ctx.update.callback_query.message.message_id,
        undefined,
        newsTypeButton(user).reply_markup
      );
    }
    await user.save();
  },

  // Next and previous for articles
  ARTICLE: async (ctx, dataAction) => {
    const text = dataAction.split("_")[1];

    if (text == "PRE") {
      if (ctx.session.articleNumber - 1 < 0) {
        return ctx.reply("مقاله قدیمی‌تری موجود نیست ...");
      }
      ctx.session.articleNumber--;
      const article = await ArticlesDatabase.findOne({})
        .skip(ctx.session.articleNumber)
        .exec();

      if (article) {
        await ctx.replyWithPhoto(
          { url: "https://patternzy.ir/1.jpg" },
          {
            caption: `🌐 ${article.title} \n〰️〰️〰️\n ${article.caption}`,
            ...botArticlesButton("https://patternzy.ir/1.jpg"),
          }
        );
      }
    } else if (text == "NEXT") {
      ctx.session.articleNumber++;
      const article = await ArticlesDatabase.findOne({})
        .skip(ctx.session.articleNumber)
        .exec();

      if (article) {
        await ctx.replyWithPhoto(
          { url: "https://patternzy.ir/1.jpg" },
          {
            caption: `🌐 ${article.title} \n〰️〰️〰️\n ${article.caption}`,
            ...botArticlesButton("https://patternzy.ir/1.jpg"),
          }
        );
      } else {
        ctx.reply("مقاله جدیدتری موجود نیست ...");
      }
    }
  },

  // Roadmap buttons
  ROAD: async (ctx, dataAction) => {
    let text = await dataAction.split("_")[1];
    switch (text) {
      case "ML":
        ctx.reply("منابع یادگیری 👇");
        await ctx.reply(messages.mlRes);
        ctx.reply("نقشه راه 👇");
        ctx.reply(messages.mlRoad);
        break;
      case "NLP":
        ctx.reply("منابع یادگیری 👇");
        await ctx.reply(messages.nlpRes);
        ctx.reply("نقشه راه 👇");
        ctx.reply(messages.nlpRoad);
        break;
      case "RL":
        ctx.reply("منابع یادگیری 👇");
        await ctx.reply(messages.rlRes);
        ctx.reply("نقشه راه 👇");
        ctx.reply(messages.rlRoad);
        break;
      case "DL":
        ctx.reply("منابع یادگیری 👇");
        await ctx.reply(messages.dlRes);
        ctx.reply("نقشه راه 👇");
        ctx.reply(messages.dlRoad);
        break;
      default:
        break;
    }
  },
};

module.exports = actionMiddleware;
