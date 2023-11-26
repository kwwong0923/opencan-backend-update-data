const axios = require("axios");
const { Tweet } = require("../models");

let count = 0;

const getTwitterAPI = () => {
  let apiKey = "";
  switch (count) {
    case 0:
      apiKey = process.env.APIFY_API_KEY_1;
      count++;
      break;
    case 1:
      apiKey = process.env.APIFY_API_KEY_2;
      count++;
      break;
    case 2:
      apiKey = process.env.APIFY_API_KEY_3;
      count = 0;
      break;
  }
  return apiKey;
};

const getTweet = async () => {
  let apiKey = getTwitterAPI();
  try {
    const response = await axios.get(apiKey);

    await Tweet.removeAllTweets();

    response.data.forEach(async (tweet) => {
      const {
        tweet_avatar: tweetAvatar,
        url,
        text,
        username,
        timestamp,
      } = tweet;

      const date = new Date(timestamp);

      await Tweet.create({
        tweetAvatar,
        url,
        text,
        username,
        date,
      });
    });

    console.log("Updated Tweet");
  } catch (err) {
    console.log(err);
  }
};

module.exports = getTweet;
