var mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    posts:[{type:mongoose.Types.ObjectId,ref:"Post"}],
    email: {
      type: String,
      requied: true,
      unique: [true, "Email id already present"],
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("invalid email");
        }
      },
    },
    mobile: {
      type: Number,
      min: 10,

      unique: true,
      required: true,
    },
    token: {
      type: String, 
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    try {
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);
      user.password = hashedPassword;
      next();
    } catch (error) {
      return next(error);
    }
  } else {
    next();
  }
});
const User = new mongoose.model("User", userSchema);
module.exports = User;
