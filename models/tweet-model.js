const mongoose = require("mongoose");

const TweetSchema = new mongoose.Schema(
  {
    tweetAvatar: {
      type: String
    },
    username: {
      type: String
    },
    text: {
      type: String
    },
    url: {
      type: String
    },
    date: {
      type: Date
    }
  }, {
    timestamps: true
  }
)

TweetSchema.statics.removeAllTweets = async function() {
  await this.deleteMany({});
  console.log(`Remote all the outdated tweet`)
}

module.exports = mongoose.model("Tweet", TweetSchema);