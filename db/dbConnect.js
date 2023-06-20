const mongoose = require("mongoose");
require("dotenv").config();

async function dbConnect() {
  await mongoose.connect(process.env.DB_URL, { dbName: "practice-db" });
  console.log("successfully connected to mongoDB");
}

module.exports = dbConnect;
