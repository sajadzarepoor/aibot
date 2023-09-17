/**
 * Module for fetching news articles based on user preferences.
 * @module news
 */

const axios = require("axios");

/**
 * Fetches news articles based on user preferences and category.
 * @param {number} index - The index of the news article to retrieve.
 * @param {object} user - User information and preferences.
 * @param {function} callback - The callback function to handle the retrieved news article.
 */
function getNews(index, user, callback) {
  const category = user.cat;

  // Prepare category filter for the request.
  const resultCategory = category.map((string) => {
    return { categoryUri: string };
  });

  // Define the request configuration for fetching news articles.
  const requestConfig = {
    method: "get",
    url: "https://www.newsapi.ai/api/v1/article/getArticles",
    params: {
      query: JSON.stringify({
        $query: {
          $and: [
            {
              $or: resultCategory,
            },
            { lang: "eng" },
          ],
        },
        $filter: {
          forceMaxDataTimeWindow: "31",
          dataType: user.type,
          isDuplicate: "skipDuplicates",
        },
      }),
      resultType: "articles",
      articlesSortBy: "date",
      includeArticleEventUri: false,
      apiKey: process.env.NEWS_API_KEY,
      articleBodyLen: 750,
      articlesCount: 10,
    },
  };

  // Send a request to the News API to fetch news articles.
  axios(requestConfig)
    .then((response) => {
      // Extract and pass the retrieved news article data to the callback function.
      callback({
        title: response.data.articles.results[index].title,
        body: response.data.articles.results[index].body,
        image:
          "https://media.istockphoto.com/id/149303042/photo/futuristic-man.jpg?s=612x612&w=0&k=20&c=9hB6qsugxOUPeoqmAhytBlwXKjR9gBWP0vw527wxD74=",
        link: response.data.articles.results[index].url,
      });
    })
    .catch((error) => {
      /**
       * Handles errors that may occur during the News API request.
       * @param {Error} error - The error object.
       */
      console.error("NEWS API ERROR:", error);
    });
}

module.exports = getNews;
