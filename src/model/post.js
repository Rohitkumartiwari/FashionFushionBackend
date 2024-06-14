const mongoose=require("mongoose");
 const postSchema=mongoose.Schema({
    title:{type:String},
    content:{type:String},
    author:{type:mongoose.Types.ObjectId,ref:"User"},
    comments:[{type:mongoose.Types.ObjectId,ref:"Comment"}]
 });
 module.exports=mongoose.model("Post",postSchema);
 
