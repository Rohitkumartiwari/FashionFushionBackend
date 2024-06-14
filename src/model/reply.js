const mongoose=require("mongoose");
const replySchema=mongoose.Schema({
    reply:{type:String},
    postId:{type:mongoose.Types.ObjectId,ref:"Post"},
    commentId:{type:mongoose.Types.ObjectId,ref:"Comment"},
    author:{type:mongoose.Types.ObjectId,ref:"User"},
});
module.exports=mongoose.model("Reply",replySchema);