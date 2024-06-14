var mongoose = require("mongoose");
const validator = require("validator");
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
    },
    category: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
    rating: {
      rate: {
        type: Number,
      },
      count: {
        type: Number,
      },
    },
  },
  { timestamps: true }
);
const Product = new mongoose.model("Product", productSchema);
module.exports = Product;
