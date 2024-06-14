const mongoose = require("mongoose");
const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    discount_type: {
        type: String,
        enum: ['percent', 'fixed_amount'],
        required: true
    },
    discount_value: {
        type: Number,
        required: true
    },
      
    is_active: {
        type: Boolean,
        default: true
    },
     
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});
const Coupon =new mongoose.model("Coupon", couponSchema);
module.exports = Coupon;