var express = require("express");
var cors = require("cors");
const server = express();
var multer = require("multer");
var dotenv = require("dotenv");
const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
dotenv.config();
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use(express.json());
server.use(cors());
const crypto = require("crypto");
const User = require("./src/model/users");
const Product = require("./src/model/product");
const WishList = require("./src/model/wishList");
const Address = require("./src/model/address");
const connectDb = require("./utils/db");
const nodemailer = require("nodemailer");
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
var upload = multer({ storage: storage });
const {
  getUserList,
  getUserDetail,
  updateProfile,
  registerMethod,
  getPayment,
  getOrderList,
  getProductList,
  cartItemDelete,
  getProductDetail,
  addCartToDb,
  getCartToDb,
  updateCartDetail,
  addCoupon,
  getCoupon,
  addAddress,
  getAddress,
  getAddressData,
  updateAddress,
  addressDelete,
  getPost,
  postData,
  postComment,
  postReply,
  getComment,
  getReply
} = require("./src/controller/userController");
const generateJWTSecret = () => {
  return crypto.randomBytes(32).toString("hex");
};

const JWT_SECRET = generateJWTSecret();

connectDb().then(() => {
  app.get("/users", getUserList);
  app.get("/products", getProductList);
  // app.get("/products/:category", getProductCategory);
  app.get("/productDetails/:category/:_id", getProductDetail);
  app.get("/user/:_id", getUserDetail);
  app.post("/cart-update/:_id/:userId", updateCartDetail);
  app.post("/updateProfile/:email", upload.single("image"), updateProfile);
  app.post("/register", registerMethod);
  app.post("/cart", addCartToDb);
  app.get("/cart-list/:userId", getCartToDb);
  app.post("/add-coupon", addCoupon);
  app.get("/get-coupon", getCoupon);
  app.post("/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      const existingUser = await User.findOne({ email });
      console.log(existingUser, "existingUser");
      if (!existingUser) {
        return res.status(400).json({ message: "Email not  existed" });
      }
      const token = jwt.sign({ id: existingUser._id }, JWT_SECRET, {
        expiresIn: "1d",
      });
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "sonutiwari.july@gmail.com",
          pass: "kzkz ykzt svmd ckaj",
        },
      });

      var mailOptions = {
        from: "sonutiwari.july@gmail.com",
        to: "rohittiwari.5july@gmail.com",
        subject: "Sending Email using Node.js",
        text: `http://localhost:3000/reset-password/${existingUser._id}/${token}`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          return res.status(200).send({ message: "message send" });
        }
      });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  });
  app.post("/reset-password/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    try {
      // Verify the token
      const decodedToken = jwt.verify(token, JWT_SECRET);
      if (decodedToken) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findByIdAndUpdate(id, { password: hashedPassword });
        res.status(200).json({ message: "Password updated successfully" });
      }
    } catch (error) {
      console.error("Error updating password:", error);
      res.status(400).json({ message: "Error updating password" });
    }
  });
  app.post("/addProduct", async (req, res) => {
    try {
      const product = new Product(req.body);
      const product1 = await product.save();
      res.status(201).res.send(product1);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  });
  app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      // Check if user exists
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ errors: [{ message: "Invalid email" }] });
      }

      // Compare password
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res
          .status(401)
          .json({ errors: [{ message: "Invalid password" }] });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, JWT_SECRET);

      // Send token in response
      res.json({ user, token });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app.post("/wishlist", async (req, res) => {
    const { category, description, image, price, userId, title, _id } =
      req.body;
    try {
      const newWishList = await WishList.create({
        category,
        description,
        productId: _id,
        image,
        price,
        title,
        userId,
      });
      res.status(201).json(newWishList);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  app.get("/wishlistData/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const wishlistItems = await WishList.find({ userId });
      res.json(wishlistItems);
    } catch (error) {
      console.error("Error fetching wishlist items:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.delete("/wishlist-delete/:_id/:userId", async (req, res) => {
    try {
      const { _id, userId } = req.params;
      console.log(_id, userId, " _id, userId");
      // Find and delete the wishlist item from the database
      const deletedItem = await WishList.findOneAndDelete({
        productId: _id,
        userId: userId,
      });

      if (!deletedItem) {
        return res.status(404).json({ error: "Wishlist item not found" });
      }

      // Send deleted item as JSON response
      res.json(deletedItem);
    } catch (error) {
      console.error("Error deleting wishlist item:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  app.delete("/cart-delete/:_id/:userId", cartItemDelete);
  app.delete("/address-delete/:_id", addressDelete);
  app.post("/update-payment", getPayment);
  app.post("/posting/:author", postData);
  app.post("/add-address", addAddress);
  app.get("/get-address/:userId", getAddress);
  app.get("/get-post", getPost);
  app.post("/post-comment",postComment);
  app.get("/get-comment",getComment);
  app.post("/post-reply",postReply);
  app.get("/get-reply",getReply);
  app.get("/get-address-data/:_id", getAddressData);
  app.post("/update-address/:_id", updateAddress);
  app.get("/order-list/:userId", getOrderList);
  app.listen(4000, () => {
    console.log(`port is running on ${process.env.PORT}`);
  });
});
