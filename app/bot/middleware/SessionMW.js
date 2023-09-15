const chatBot = require("../../API/chatbot");

const STATE_LIST = {
  CHATBOT: "chatbot",
};

function SessionMiddleware(ctx, next) {
  if (!ctx.session.state) return next();
  const ActivatedState = ctx.session.state;
  const allStatesValues = Object.values(STATE_LIST);
  if (allStatesValues.includes(ActivatedState) && EventListener[ActivatedState])
    return EventListener[ActivatedState](ctx, next);
  next();
}

const EventListener = {
  // defin middleware for chatbot state
  [STATE_LIST.CHATBOT]: async (ctx, next) => {
    if (!ctx.message) return next();

    const typing = await ctx.reply("در حال تایپ کردن ...");
    ctx.sendChatAction("typing");
    const dotsInterval = setInterval(() => {
      ctx.sendChatAction("typing");
    }, 5000);

    await chatBot(ctx.message.text, (res) => {
      ctx.deleteMessage(typing.message_id);
      clearInterval(dotsInterval);
      if (res) {
        ctx.reply(`${res}`);
      }
    });

    next();
  },
  //
};

module.exports = SessionMiddleware;
