const mongoose = require("mongoose");
require("dotenv").config();

module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGO_CONNECT);
    console.log("connected to mongoDB...");
  } catch (error) {
    console.log(error);
  }
};
