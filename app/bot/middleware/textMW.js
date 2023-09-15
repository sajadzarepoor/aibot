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
const { nextTick } = require("process");
const UserDatabase = require("../../../model/users");
const ArticlesDatabase = require("../../../model/botArticles");

// main menu buttons
const mainMenuMiddleWare = (ctx, next) => {
  if (!ctx.message) return next();
  const text = ctx.message.text;
  if (text)
    if (Object.values(mainMenuButtonTexts).includes(text))
      mainMenuFunctions[text](ctx);
  next();
};
//

// back button
const backButtonMiddleWare = (ctx, next) => {
  if (!ctx.message) return next();
  const text = ctx.message.text;
  if (text)
    if (text == "بازگشت 🔙") {
      ctx.session.articleNumber = undefined;
      ctx.session.newsNumber = undefined;
      ctx.session.state = undefined;
      ctx.reply(messages.choosYourNewOp, mainMenuButton);
    }
  next();
};
//

// main menu actions
const mainMenuFunctions = {
  // chatbot
  [mainMenuButtonTexts.chat]: (ctx) => {
    ctx.reply(messages.chatBotMessageGreeting, backBotton);
    ctx.reply(messages.chatBotMessageAsk, suggestionButtons);
    ctx.session.state = "chatbot";
  },
  // news
  [mainMenuButtonTexts.news]: async (ctx) => {
    ctx.session.newsNumber = 0;
    userId = ctx.update.message.from.id;
    let user = await UserDatabase.findOne({ id: userId });
    console.log(user);
    if (user.config) {
      await getNews(0, user, async ({ title, body, image, link }) => {
        await ctx.replyWithPhoto(
          { url: image },
          {
            caption: `🌐 ${title} \n〰️〰️〰️\n ${body}`,
            ...newsLinkButton(link),
          }
        );
      });
      ctx.reply("〰️〰️〰️", backBotton);
    } else {
      ctx.reply(messages.choosYourCat, categoryBotton(user));
    }
  },
  // bot Articles
  [mainMenuButtonTexts.articles]: async (ctx) => {
    const article = await ArticlesDatabase.find({});

    lastArticleIndex = article.length - 1;
    ctx.session.articleNumber = lastArticleIndex;

    ctx.reply("〰️〰️〰️", backBotton);
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

  [mainMenuButtonTexts.roadMap]: async (ctx) => {
    ctx.reply("〰️〰️〰️", backBotton);
    ctx.reply(messages.choosYourCat, roadMapBotton);
  },
};
//
module.exports = {
  mainMenuMiddleWare,
  backButtonMiddleWare,
};
