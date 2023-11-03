const axios = require("axios");
const CustomError = require("../errors");
const { News } = require("../models");
const cheerio = require("cheerio");

const newsArr = [
  "canada",
  "canada-britishcolumbia",
  "canada-calgary",
  "canada-manitoba",
  "canada-thunderbay",
  "canada-london",
  "canada-kitchenerwaterloo",
  "canada-toronto",
  "canada-hamiltonnews",
  "canada-montreal",
  "canada-newbrunswick",
];

const extraNewsArr = [
  "canada-edmonton",
  "canada-saskatchewan",
  "canada-saskatoon",
  "canada-sudbury",
  "canada-windsor",
  "canada-pei",
  "canada-novascotia",
  "canada-newfoundland",
  "canada-north",
  "canada-ottawa",
];
const getSingleCategoryNews = async (category) => {
  try {
    const response = await axios.get(
      `${process.env.XML_PARSER}=${process.env.NEWS_LINK}${category}`
    );

    if (!response.data.success === true || response.data.data === undefined) {
      throw new CustomError.BadRequestError(`Cannot get the news`);
    }

    const newsList = response.data.data;

    const formattedCategory = newsList[0]?.source.text
      .split("|")
      .map((item) => item.trim())[1];

    await News.removeNewsByCategory(formattedCategory);

    newsList.forEach(async (news) => {
      const { title, url, description: htmlString, date: timestamps } = news;
      const date = new Date(timestamps);
      const $ = cheerio.load(htmlString);
      const image = $("img").attr("src");
      const description = $("p").text();
      const category = news.source.text
        .split("|")
        .map((item) => item.trim())[1];

      await News.create({
        title,
        description,
        url,
        image,
        date,
        category,
      });
    });
  } catch (err) {
    console.log(err);
  }
};

const getNews = async () => {
  for (let i = 0; i < newsArr.length; i++) {
    await getSingleCategoryNews(newsArr[i]);
  }

  console.log("Updated News (first)");

  setTimeout(async () => {
    for (let i = 0; i < extraNewsArr.length; i++) {
      await getSingleCategoryNews(extraNewsArr[i]);
    }

    console.log("Updated News (second)");
  }, 3 * 60 * 1000);
};

module.exports = getNews;
