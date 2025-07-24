const mongoose = require("mongoose");
require("dotenv").config();

exports.database = () => {
  try {
    mongoose.connect(process.env.MONGODB_URI);
    console.log("DB connected successfully");

  } catch (error) {
    console.log("Issue in DB connection");
    console.log(error.message);
    process.exit(1);
  }
};
