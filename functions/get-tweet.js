const axios = require("axios");
const { Tweet } = require("../models");

const getTweet = async () => {
  try {
    const response = await axios.get(
      `https://api.apify.com/v2/actor-tasks/open_can~tweet-flash-task/run-sync-get-dataset-items?token=${process.env.APIFY_API_KEY}`
    );

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

    console.log("Updated Tweet")
  } catch (err) {
    console.log(err);
  }
};

module.exports = getTweet;