const mongoose = require('mongoose');
require('dotenv').config();

mongoose.Promise = global.Promise;

// Connect MongoDB at default port 27017.

const mongoUrl =
  process.env.NODE_ENV === 'development'
    ? process.env.MONGO_URL
    : process.env.MONGO_REMOTE_URL;

// const mongoUrl = process.env.MONGO_URI;

const dbConnect = async () => {
  console.log(' I am in db connecttino');
  console.log(mongoUrl);
  mongoose.connect(
    mongoUrl,
    // "mongodb://localhost:27017/womenests",
    {
      useNewUrlParser: true,
    },
    err => {
      if (!err) {
        console.log('MongoDB Connection Succeeded.');
      } else {
        console.log('Error in DB connection: ' + err);
      }
    },
  );
};

module.exports = dbConnect;
