const mongoose=require("mongoose");
const commentSchema=mongoose.Schema({
    text:{type:String},
    author:{type:mongoose.Types.ObjectId,ref:"User"},
    postId:{type:mongoose.Types.ObjectId,ref:"Post"},
    reply:[{type:mongoose.Types.ObjectId,ref:"Reply"}]
});
module.exports=mongoose.model("Comment",commentSchema)