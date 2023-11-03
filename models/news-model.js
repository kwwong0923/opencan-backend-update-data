const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide title of the news"],
    },
    description: {
      type: String,
    },
    url: {
      type: String,
      required: [true, "Please provide the url of the news"],
    },
    image: {
      type: String,
    },
    date: {
      type: Date,
    },
    category: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

NewsSchema.statics.removeAllNews = async function () {
  await this.deleteMany({});
  console.log("Remote all the outdated news");
};

NewsSchema.statics.removeNewsByCategory = async function (category) {
  if (category) {
    await this.deleteMany({ category });
    console.log(`Remote all the outdated ${category} news`);
  } else {
    console.log(`remove method category: ${category}`);
  }
};
module.exports = mongoose.model("News", NewsSchema);
