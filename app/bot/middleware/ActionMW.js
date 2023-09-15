// const messages = require("../utils/messages");
const chatBot = require("../../API/chatbot");
const getNews = require("../../API/news");
const {
  newsLinkButton,
  categoryBotton,
  newsTypeBotton,
  botArticlesButton,
} = require("../utils/buttonManager");
const UserDatabase = require("../../../model/users");
const ArticlesDatabase = require("../../../model/botArticles");
const messages = require("../utils/messages");
// defing all action in object
const actionMap = {
  SUG: /^SUG_/,
  NEWS: /^NEWS_\w+/,
  CAT: /^CAT_/,
  TYPE: /^TYPE_/,
  ARTICLE: /^ARTICLE_/,
  ROAD: /^ROAD_/,
};
//

// middleware for actions
const actionMiddleware = (ctx, next) => {
  if (!ctx.update.callback_query) return next();
  const dataAction = ctx.update.callback_query.data;

  if (dataAction) {
    const actionValues = Object.values(actionMap);

    for (let i = 0; i < actionValues.length; i++) {
      const isDataActoinExtist = dataAction.match(actionValues[i]);

      if (isDataActoinExtist) {
        actoinFunctions[Object.keys(actionMap)[i]](ctx, dataAction);
      }
    }
  }
  next();
};

// defin actions functionality
const actoinFunctions = {
  // suggestion action
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
  //

  // next and previous for news
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
  //

  // NEWS catrogory config
  CAT: async (ctx, dataAction) => {
    let text = dataAction.split("_");
    const userId = ctx.update.callback_query.from.id;
    let user = await UserDatabase.findOne({ id: userId });

    if (text.length > 1) {
      text = text.slice(1).join("_");
    }
    // next botton
    if (text == "NEXT") {
      ctx.editMessageText(
        "چه مطالبی را دوست دارید دریافت کنید ؟",
        newsTypeBotton(user)
      );
      return;
    }
    // get user from db

    // add category to db
    if (!user.cat.includes(text)) {
      user.cat.push(text);
      //
      ctx.telegram.editMessageReplyMarkup(
        ctx.update.callback_query.message.chat.id,
        ctx.update.callback_query.message.message_id,
        undefined,
        categoryBotton(user).reply_markup
      );
      //
    } else {
      user.cat = user.cat.filter((item) => item != text);
      //
      ctx.telegram.editMessageReplyMarkup(
        ctx.update.callback_query.message.chat.id,
        ctx.update.callback_query.message.message_id,
        undefined,
        categoryBotton(user).reply_markup
      );
      //
    }
    await user.save();
  },
  //
  //NEWS type config
  TYPE: async (ctx, dataAction) => {
    let text = await dataAction.split("_")[1];
    const userId = ctx.update.callback_query.from.id;
    let user = await UserDatabase.findOne({ id: userId });

    if (text == "submit") {
      await UserDatabase.updateOne({ id: userId }, { $set: { config: true } });
      return ctx.editMessageText(
        "تنظیمات شما با موفقیت ثبت شد ✅\nلطفا مجدد روی دکمه اخبار کلیک کنید"
      );
    }

    // add type to db
    if (!user.type.includes(text)) {
      user.type.push(text);

      ctx.telegram.editMessageReplyMarkup(
        ctx.update.callback_query.message.chat.id,
        ctx.update.callback_query.message.message_id,
        undefined,
        newsTypeBotton(user).reply_markup
      );
    } else {
      user.type = user.type.filter((item) => item != text);

      ctx.telegram.editMessageReplyMarkup(
        ctx.update.callback_query.message.chat.id,
        ctx.update.callback_query.message.message_id,
        undefined,
        newsTypeBotton(user).reply_markup
      );
    }
    await user.save();
  },

  // next and previous for articles
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
  //
  // roadmap bottons
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
//
//

module.exports = actionMiddleware;
