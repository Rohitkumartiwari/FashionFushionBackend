const mongoose = require("mongoose");
const addressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pincode: {
    type: Number,
    required: true,
  },
  addressType: {
    type: String,
    required: true,
    enum: ["home", "office"],
  },
});
const Address = mongoose.model("Address", addressSchema);

module.exports = Address;
