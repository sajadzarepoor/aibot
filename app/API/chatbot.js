/**
 * Module for interacting with the chatbot using the OpenAI GPT-3.5 Turbo model.
 * @module chatBot
 */

const { OpenAIApi, Configuration } = require("openai");

/**
 * Interacts with the chatbot and sends the user's input text.
 * @param {string} text - The user's input text.
 * @param {function} callback - The callback function to handle the bot's response.
 */
function chatBot(text, callback) {
  try {
    // Create a new configuration with the OpenAI API key.
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Initialize the OpenAI API client.
    const openai = new OpenAIApi(configuration);

    /**
     * Get the chatbot's response.
     * @async
     * @function
     * @inner
     * @throws {Error} If an error occurs while interacting with the chatbot.
     */
    const getResponse = async () => {
      // Create a chat completion request with the user's message.
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: text,
          },
        ],
      });

      // Extract and pass the bot's response to the callback function.
      callback(completion.data.choices[0].message.content);
    };

    // Invoke the getResponse function to interact with the chatbot.
    getResponse();
  } catch (error) {
    console.error("Chatbot error occurred:", error);
  }
}

module.exports = chatBot;
