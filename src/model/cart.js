const mongoose = require("mongoose");

// Define the cart item schema
const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    // required: true,
  },
  quantity: {
    type: Number,
    min: 1,
    // required: true, // You can also make this field required if necessary
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  title: {
    type: String,
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
});

// Define the cart schema
const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: cartItemSchema,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Cart model based on the schema
const Cart = mongoose.model("Cart", cartSchema);

// Export the Cart model
module.exports = Cart;