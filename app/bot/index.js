// external madules
const LocalSession = require("telegraf-session-local");
const { Telegraf, Markup, Scenes } = require("telegraf");
// middlewares
const textmiddleware = require("./middleware/textMW");
const actionMiddleware = require("./middleware/ActionMW");
const SessionMiddleware = require("./middleware/SessionMW");
// internal modules
const getNews = require("../API/news");
const { mainMenuButton, newsLinkButton } = require("./utils/buttonManager");
const messages = require("./utils/messages");
const saveUserToDatabase = require("./utils/saveUserToDatabase");
//

let userId = 1455464849;
let lastNewsSavedLink = "";

function startBot() {
  //initial
  const bot = new Telegraf(process.env.BOT_TOKEN);
  bot.launch();
  bot.use(new LocalSession({ database: "session.json" }));
  //
  // start command
  bot.start((ctx) => {
    saveUserToDatabase(ctx);
    ctx.reply(
      messages.greetingMessage(ctx.message.from.first_name),
      mainMenuButton
    );
  });
  //

  // Middlwares
  bot.use(textmiddleware.backButtonMiddleWare);
  bot.use(SessionMiddleware);
  bot.use(textmiddleware.mainMenuMiddleWare);
  bot.use(actionMiddleware);
  //

  // Sending Last News Automatic
  // function sendLastNews() {
  //   getNews(0, ({ title, body, image, link }) => {
  //     if (link == lastNewsSavedLink) return;

  //     bot.telegram.sendPhoto(userId, image, {
  //       caption: `🆕 خبر جدید :\n*🌐 ${title}* \n〰️〰️〰️\n ${body}\n\n[ادامه مطلب](${link})`,
  //       parse_mode: "Markdown",
  //     });
  //     lastNewsSavedLink = link;
  //   });
  // }
  // setInterval(sendLastNews, 1000 * 60 * 60);
  // //
}
module.exports = { startBot };
