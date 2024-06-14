const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    reuired: true,
  },
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
  amount: {
    type: Number,
    reuired: true,
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  productIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Reference to the User model
      required: true,
    },
  ],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
const Payment = new mongoose.model("Payment", PaymentSchema);
module.exports = Payment;
