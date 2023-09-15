const { OpenAIApi, Configuration } = require("openai");

function chatBot(text, callback) {
  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    const getResponse = async () => {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: text,
          },
        ],
      });
      callback(completion.data.choices[0].message.content);
    };
    getResponse();
  } catch (error) {
    console.error("Chatbot error occurred:", error);
  }
}

module.exports = chatBot;
