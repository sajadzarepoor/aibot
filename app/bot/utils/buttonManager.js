/**
 * Button manager module to create and manage keyboard buttons.
 * @module buttonManager
 */

const { Telegraf, Markup } = require("telegraf");

// Main menu buttons texts
const mainMenuButtonTexts = {
  chat: "گفت‌وگو با چت‌بات 🤖",
  news: "اخبار و مقالات🌐",
  articles: "مقالات ربات 📚",
  roadMap: "نقشه‌راه و منابع 🤔",
  tools: "ابزارهای هوش مصنوعی 🧰",
  setting: "تنظیمات ⚙️",
};

// News categories array
const newsCategoriesArray = [
  "dmoz/Computers/Artificial_Intelligence",
  "dmoz/Computers/Computer_Science",
  "dmoz/Computers/Programming",
  "dmoz/Science/Technology",
  "dmoz/Computers/Algorithms",
];

// News types array
const newsTypeArray = ["news", "blog"];

// Main menu buttons keyboard markup
const mainMenuButton = Markup.keyboard([
  [mainMenuButtonTexts.chat],
  [mainMenuButtonTexts.articles, mainMenuButtonTexts.news],
  [mainMenuButtonTexts.roadMap, mainMenuButtonTexts.tools],
  [mainMenuButtonTexts.setting],
]).resize();

// Back button
const backBotton = Markup.keyboard([["بازگشت 🔙"]]).resize();

// Suggestion buttons
const suggestionButtons = Markup.inlineKeyboard([
  [
    {
      text: "هوش مصنوعی چیست؟",
      callback_data: "SUG_هوش مصنوعی چیست؟",
    },
    { text: "حوزه‌های هوش مصنوعی", callback_data: "SUG_حوزه‌های هوش مصنوعی" },
  ],
  [
    {
      text: "را از کجا شروع کنم؟ ai",
      callback_data: "SUG_هوش را از کجا شروع کنم؟",
    },
    {
      text: "ai در کجا کاربرد دارد؟",
      callback_data: "SUG_هوش در کجا کاربرد دارد؟",
    },
  ],
]);

/**
 * Create news link button and navigation buttons.
 * @param {string} link - The URL link to the full news article.
 * @returns {Markup} - Inline keyboard markup.
 */
function newsLinkButton(link) {
  const inlineKeyboard = Markup.inlineKeyboard([
    [Markup.button.url("مطالعه متن کامل", link)],
    [
      {
        text: "اخبار قدیمی‌تر",
        callback_data: "NEWS_PRE",
      },
      { text: "اخبار جدیدتر", callback_data: "NEWS_NEXT" },
    ],
  ]);
  return inlineKeyboard;
}

/**
 * Create category buttons based on user preferences.
 * @param {object} user - User object with category preferences.
 * @returns {Markup} - Inline keyboard markup.
 */
function categoryBotton(user) {
  const exitsCatArray = checkExist(user);

  return Markup.inlineKeyboard([
    [
      {
        text: exitsCatArray[0] ? "هوش مصنوعی ✅" : "هوش مصنوعی",
        callback_data: "CAT_dmoz/Computers/Artificial_Intelligence",
      },
      {
        text: exitsCatArray[1] ? "علوم کامپیوتر ✅" : "علوم کامپیوتر",
        callback_data: "CAT_dmoz/Computers/Computer_Science",
      },
    ],
    [
      {
        text: exitsCatArray[2] ? "برنامه نویسی ✅" : "برنامه نویسی",
        callback_data: "CAT_dmoz/Computers/Programming",
      },
      {
        text: exitsCatArray[3] ? "تکنولوژی ✅" : "تکنولوژی",
        callback_data: "CAT_dmoz/Science/Technology",
      },
      {
        text: exitsCatArray[4] ? "الگوریتم ✅" : "الگوریتم",
        callback_data: "CAT_dmoz/Computers/Algorithms",
      },
    ],
    [{ text: "مرحله بعد ⬅️", callback_data: "CAT_NEXT" }],
  ]);

  function checkExist(user) {
    let exitsCatArray = [];
    newsCategoriesArray.forEach((item) => {
      const existsInDatabase = user.cat.includes(item);
      exitsCatArray.push(existsInDatabase);
    });
    return exitsCatArray;
  }
}

/**
 * Create news type buttons based on user preferences.
 * @param {object} user - User object with news type preferences.
 * @returns {Markup} - Inline keyboard markup.
 */
function newsTypeBotton(user) {
  const exitsTypeArray = checkExist(user);
  return Markup.inlineKeyboard([
    [
      {
        text: exitsTypeArray[0] ? "اخبار ✅" : "اخبار",
        callback_data: "TYPE_news",
      },
      {
        text: exitsTypeArray[1] ? "مقالات ✅" : "مقالات",
        callback_data: "TYPE_blog",
      },
    ],
    [
      {
        text: "ثبت اطلاعات",
        callback_data: "TYPE_submit",
      },
    ],
  ]);

  function checkExist(user) {
    let exitsCatArray = [];
    newsTypeArray.forEach((item) => {
      const existsInDatabase = user.type.includes(item);
      exitsCatArray.push(existsInDatabase);
    });
    return exitsCatArray;
  }
}

/**
 * Create bot articles navigation buttons.
 * @returns {Markup} - Inline keyboard markup.
 */
function botArticlesButton() {
  const inlineKeyboard = Markup.inlineKeyboard([
    [
      {
        text: "مقالات قدیمی‌تر",
        callback_data: "ARTICLE_PRE",
      },
      { text: "مقالات جدیدتر", callback_data: "ARTICLE_NEXT" },
    ],
  ]);
  return inlineKeyboard;
}

// Roadmap inline buttons
const roadMapBotton = Markup.inlineKeyboard([
  [
    {
      text: "یادگیری ماشین",
      callback_data: "ROAD_ML",
    },
    { text: "پردازش زبان طبیعی", callback_data: "ROAD_NLP" },
  ],
  [
    {
      text: "هوش مصنوعی تقویتی",
      callback_data: "ROAD_RL",
    },
    { text: "یادگیری عمیق", callback_data: "ROAD_DL" },
  ],
]);

// Export all button-related functions and objects.
module.exports = {
  mainMenuButton,
  mainMenuButtonTexts,
  backBotton,
  suggestionButtons,
  newsLinkButton,
  categoryBotton,
  newsTypeBotton,
  botArticlesButton,
  roadMapBotton,
};
