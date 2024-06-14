
var mongoose = require("mongoose");
var dotenv = require("dotenv");
dotenv.config();
const connectDb = async () => {
  try {
    await mongoose.connect(`mongodb+srv://sonutiwarijuly:quL0tVuuIImwPs9x@cluster0.zgpxj2z.mongodb.net/ecommerce`);
    console.log("connected to database");
  } catch (error) {
    console.log("not connected", error);
  }
};
module.exports = connectDb;