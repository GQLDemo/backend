const mongodbUri = require("./mongodbUri");
const mongoose = require("mongoose");
const connectDB = async () => {
  const conn = await mongoose.connect(mongodbUri);
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};
module.exports = connectDB;
