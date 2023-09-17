/**
 * Middleware for managing user session states and interactions.
 * @module SessionMiddleware
 */

// Import the chatbot module.
const chatBot = require("../../API/chatbot");

// Define the possible user session states.
/**
 * this Object containing session possible states.
 * @const {Object}
 */
const STATE_LIST = {
  CHATBOT: "chatbot",
};

/**
 * Middleware to handle different user session states.
 * @param {object} ctx - The Telegraf context object.
 * @param {function} next - The next middleware function.
 */
function SessionMiddleware(ctx, next) {
  if (!ctx.session.state) return next();
  const activatedState = ctx.session.state;
  const allStatesValues = Object.values(STATE_LIST);

  if (
    allStatesValues.includes(activatedState) &&
    EventListener[activatedState]
  ) {
    return EventListener[activatedState](ctx, next);
  }

  next();
}

/**
 * Object containing event listeners for different session states.
 * @const {Object}
 */
const EventListener = {
  // Middleware for the chatbot state.
  [STATE_LIST.CHATBOT]: async (ctx, next) => {
    if (!ctx.message) return next();

    // Show typing indicator and send user's message to the chatbot.
    const typing = await ctx.reply("در حال تایپ کردن ...");
    ctx.sendChatAction("typing");

    // Set up a typing indicator interval.
    const dotsInterval = setInterval(() => {
      ctx.sendChatAction("typing");
    }, 5000);

    // Use the chatBot module to interact with the chatbot.
    await chatBot(ctx.message.text, (res) => {
      // Remove the typing indicator and clear the interval.
      ctx.deleteMessage(typing.message_id);
      clearInterval(dotsInterval);

      // Send the chatbot's response to the user.
      if (res) {
        ctx.reply(`${res}`);
      }
    });

    next();
  },
};

module.exports = SessionMiddleware;
