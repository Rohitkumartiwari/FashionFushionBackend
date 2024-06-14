const User = require("../model/users");
const jwt = require("jsonwebtoken");
var multer = require("multer");
const crypto = require("crypto");
const Payment = require("../model/payment");
const Product = require("../model/product");
const Cart = require("../model/cart");
const Coupon = require("../model/coupon");
const Post=require("../model/post");
const Address = require("../model/address");
const Comment=require("../model/comment");
const Reply=require("../model/reply");
const generateJWTSecret = () => {
  return crypto.randomBytes(32).toString("hex");
};

const JWT_SECRET = generateJWTSecret();
const getUserList = async (req, res) => {
  try {
    const users = await User.find();
  return  res.send(users);
  } catch (err) {
   return res.status(500).json({ message: err.message });
  }
};
const getCoupon = async (req, res) => {
  try {
    const coupons = await Coupon.find();
   return res.send(coupons);
  } catch (err) {
   return  res.status(500).json({ message: err.message });
  }
};
const getProductList = async (req, res) => {
  try {
    let query = {}; // Define an empty query object initially

    const { search, limit, page, category } = req.query;

    // If category is provided, filter products by category
    if (category) {
      query.category = category;
    }

    // Adding search functionality
    if (search) {
      query.title = { $regex: new RegExp(search, "i") }; // Case-insensitive search by title
    }

    // Parse pagination parameters or use defaults
    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = parseInt(limit, 10) || 10;

    // Calculate skip value for pagination
    const skip = (pageNumber - 1) * pageSize;

    // Fetch products based on query and pagination
    const products = await Product.find(query).skip(skip).limit(pageSize);

    // If categoriType is not provided, calculate total count of all products
    const totalCount = category
      ? await Product.countDocuments(query)
      : await Product.countDocuments();

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / pageSize);

    // Return paginated products and total pages
    res.json({ products, totalPages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getUserDetail = async (req, res) => {
  const { _id } = req.params;
  try {
    const getUser = await User.findOne({ _id });
    if (!getUser) {
      return res.status(401).json({ errors: [{ message: "Invalid email" }] });
    }
    return res.status(200).json(getUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getProductCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const productCategory = await Product.find({ category });
    if (!productCategory) {
      return res.status(401).json({ errors: [{ message: "Invalid email" }] });
    }
    return res.status(200).json(productCategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getProductDetail = async (req, res) => {
  const { category, _id } = req.params;
  try {
    const productDetail = await Product.findOne({ category, _id });
    if (!productDetail) {
      return res.status(401).json({ errors: [{ message: errors.message }] });
    }
    return res.status(200).json(productDetail);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getOrderList = async (req, res) => {
  const { userId } = req.params;

  try {
    const getOrderList = await Payment.find({ userId });

    if (!getOrderList) {
      return res.status(401).json({ errors: [{ message: "Invalid user" }] });
    }
    const productIdsArrays = getOrderList.map((payment) => payment.productIds);

    const allProductIds = productIdsArrays.flat();

    const products = await Product.find({ _id: { $in: allProductIds } }).catch(
      (err) => console.error(err)
    );

    return res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getAddress = async (req, res) => {
  const { userId } = req.params;

  try {
    const getAddressList = await Address.find({ userId });
    if (!getAddressList) {
      return res.status(401).json({ errors: [{ message: "Invalid user" }] });
    }
    return res.status(200).json(getAddressList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
 
const getAddressData = async (req, res) => {
  const { _id } = req.params;

  try {
    const getAddressDataa = await Address.find({ _id });
    if (!getAddressDataa) {
      return res.status(401).json({ errors: [{ message: "Invalid Address" }] });
    }
    return res.status(200).json(getAddressDataa);
  } catch (err) {
   return  res.status(500).json({ message: err.message });
  }
};
const getCartToDb = async (req, res) => {
  const { userId } = req.params;

  try {
    const getCartList = await Cart.find({ userId });

    if (!getCartList) {
      return res.status(401).json({ errors: [{ message: errors.message }] });
    }
    return res.status(200).json(getCartList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const cartItemDelete = async (req, res) => {
  try {
    const { _id, userId } = req.params;

    // Find and delete the wishlist item from the database
    const deletedItem = await Cart.findOneAndDelete({
      "items._id": _id,
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
};
const updateProfile = async (req, res) => {
  try {
    const { email } = req.params;
    const { name, mobile } = req.body;
    const imagePath = req.file.path.replace(/\\/g, '/');
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: { name, mobile, image: imagePath } },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(updatedUser,"updatedUser")
   return res.json(updatedUser);
  } catch (err) {
   return res.status(400).json({ message: err.message });
  }
};
const updateAddress = async (req, res) => {
  const { _id } = req.params;
  const { pincode, city, state, street, addressType } = req.body;
  try {
    const updatedAddress = await Address.findOneAndUpdate(
      { _id },
      { $set: { pincode, city, state, street, addressType } },
      { new: true }
    );
    if (!updatedAddress) {
      return res.status(404).json({ message: "User not found" });
    }
   return res.json(updatedAddress);
  } catch (err) {
   return res.status(400).json({ message: err.message });
  }
};
const addCartToDb = async (req, res) => {
  try {
    const { userId, items } = req.body;

    const newCart = new Cart({
      userId,
      items,
    });

    const savedCart = await newCart.save();
  return  res.status(201).json(savedCart);
  } catch (err) {
    console.log(err);
  return  res.status(400).json({ message: err.message });
  }
};
const registerMethod = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "user already exists" });
    }
    const newUser = new User({ name, email, mobile, password });
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: "1d",
    });
    newUser.token = token;
    await newUser.save();

   return res.status(201).json({ user: newUser, token });
  } catch (e) {
   return res.status(400).json({ message: e.message });
  }
};
const getPayment = async (req, res) => {
  try {
    const { paymentId, amount, userId, productIds, status } = req.body;

    const newPayment = new Payment({
      paymentId,
      amount,
      userId,
      productIds,
      status,
    });

    await newPayment.save();

   return res.status(200).json({ message: "Payment status updated successfully" });
  } catch (error) {
  return  res.status(500).json({ error: "Internal server error" });
  }
};
const getPost = async (req, res) => {
  
  try {
    const getPostResult = await Post.find().populate([{path:"author"},{path:"comments",populate:{path:"author"}}]);
    if (!getPostResult) {
      return res.status(401).json({ errors: [{ message: "Invalid user" }] });
    }
    return res.status(200).json(getPostResult);
  } catch (err) {
   return  res.status(500).json({ message: err.message });
  }
};
const postData = async (req, res) => {
  try {
    const { title,content } = req.body;
    const { author} = req.params;
    const newPost = new Post({
      title,content,author
    });

    await newPost.save();

    return res.status(200).json({ message: "Post added successfully" });
  } catch (error) {
    console.log(error,"err")
   return  res.status(500).json({ error: "Internal server error" });
  }
};
 const postComment = async (req, res) => {
  try {
    const { text ,author,postId} = req.body;
   

    const newComment = await Comment.create({
      text ,author,postId
    });

    const findPost = await Post.findOne({_id:postId})
    if (findPost) {
     await findPost.comments.push(newComment._id)
    }
    await findPost.save()
    return res.status(200).json({ message: "Post added successfully" });
  } catch (error) {
    console.log(error,"err")
   return  res.status(500).json({ error: "Internal server error" });
  }
};
const postReply = async (req, res) => {
  try {
    const { reply ,author,postId,commentId} = req.body;
   const newReply = await Reply.create({
      reply ,author,postId,commentId
    });

    const findComment = await Comment.findOne({_id:commentId})
    if (findComment) {
     await findComment.reply.push(newReply._id)
    }
    await findComment.save()
    // await newReply.save();

    return res.status(200).json({ message: "Reply added successfully" });
  } catch (error) {
    
   return  res.status(500).json({ error: "Internal server error" });
  }
};
const getComment = async (req, res) => {
 
  try {
    const getPostComment = await Comment.find().populate([{path:"author"},{path:"reply",populate:{path:"author"}}]);
    if (!getPostComment) {
      return res.status(401).json({ errors: [{ message: "Invalid user" }] });
    }
    return res.status(200).json(getPostComment);
  } catch (err) {
   return  res.status(500).json({ message: err.message });
  }
};
const getReply = async (req, res) => {
 
  try {
    const getReply = await Reply.find().populate({path:"author"});
    if (!getReply) {
      return res.status(401).json({ errors: [{ message: "Invalid user" }] });
    }
    return res.status(200).json(getReply);
  } catch (err) {
   return  res.status(500).json({ message: err.message });
  }
};
const addCoupon = async (req, res) => {
  const { code, discount_type, discount_value, is_active } = req.body;
  try {
    const newCoupon = new Coupon({
      code,
      discount_type,
      discount_value,
      is_active,
    });

    await newCoupon.save();
    res
      .status(201)
      .json({ message: "Coupon added successfully", coupon: newCoupon });
  } catch (error) {
   return  res.status(500).json({ message: "Internal server error" });
  }
};
const addAddress = async (req, res) => {
  const { userId, pincode, city, state, street, addressType } = req.body;
  try {
    const newAddress = new Address({
      userId,
      pincode,
      city,
      state,
      street,
      addressType,
    });
    await newAddress.save();
    res
      .status(201)
      .json({ message: "Address added successfully", address: newAddress });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const addressDelete = async (req, res) => {
  try {
    const { _id } = req.params;

    // Find and delete the wishlist item from the database
    const deletedItem = await Address.findByIdAndDelete(_id);

    if (!deletedItem) {
      return res.status(404).json({ error: "Address item not found" });
    }

    // Send deleted item as JSON response
    res.json(deletedItem);
  } catch (error) {
    console.error("Error deleting wishlist item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const updateCartDetail = async (req, res) => {
  const { userId, _id } = req.params; // Get the user ID and item ID from URL parameters
  const { type } = req.body; // Get the updated quantity from the request body

  try {
    // Find the user's cart and update the quantity of the specified item
    const updatedCart = await Cart.findOne(
      { "items._id": _id, userId: userId } // Filter condition
    );
    {
      type == 1
        ? (updatedCart.items.quantity += 1)
        : (updatedCart.items.quantity -= 1);
    }

    await updatedCart.save();

    if (!updatedCart) {
      return res.status(404).json({
        message: "Cart not found for the user or item not found in the cart",
      });
    }

    res.json(updatedCart); // Respond with the updated cart
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getUserList,
  getUserDetail,
  updateProfile,
  registerMethod,
  getPayment,
  getOrderList,
  getProductList,
  getProductCategory,
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
  cartItemDelete,
  postData,
  getPost,
  postComment,
  getComment,
  postReply,
  getReply
};
