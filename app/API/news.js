const axios = require("axios");

function getNews(index, user, callback) {
  const category = user.cat;

  const resultCategory = category.map((string) => {
    return { categoryUri: string };
  });

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

  axios(requestConfig)
    .then((response) => {
      callback({
        title: response.data.articles.results[index].title,
        body: response.data.articles.results[index].body,
        image:
          "https://media.istockphoto.com/id/149303042/photo/futuristic-man.jpg?s=612x612&w=0&k=20&c=9hB6qsugxOUPeoqmAhytBlwXKjR9gBWP0vw527wxD74=",
        link: response.data.articles.results[index].url,
      });
    })
    .catch((error) => {
      console.error("NEWS API ERROR:", error);
    });
}
module.exports = getNews;
