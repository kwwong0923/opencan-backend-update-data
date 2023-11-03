require("dotenv").config();

const express = require("express");
// Path
const path = require("path");
// logger
const logger = require("morgan");
// Cors
const cors = require("cors");
// Connect DB
const connectDB = require("./db/connectDB")
// Methods
const { getNews, getTweet, getCurrencyRate} = require("./functions")

let app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("./public"));

app.get("/", (req, res) => {
  const publicPath = path.join(__dirname, "public");
  res.sendFile(path.join(publicPath, "index.html"));
})

const port = process.env.PORT || 5000;

const start = async() => {
  try {
    await connectDB(process.env.MONGODB_URL);
    console.log("Connect to Database");
    app.listen(port, () => {
      console.log(`The server is running on port: ${port}`);
    });

    await getNews();
    await getCurrencyRate();
    await getTweet();

    setInterval(async () => {
      console.log("20 minutes Interval");
      await getTweet();
    }, 20 * 60 * 1000); // 20 minutes

    setInterval(async () => {
      console.log("1 Hour Interval")
      await getNews();
    }, 30 * 60 * 1000); // 1 hour

    setInterval(async () => {
      console.log("2 Hours Interval")
      await getCurrencyRate();
    }, 2 * 60 * 60 * 1000); // 2 hours
  }
  catch (err) {
    console.log(err);
  }
}

start();