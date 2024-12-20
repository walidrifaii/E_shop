const mongoose = require("mongoose");

const withdrawSchema = new mongoose.Schema(
    {
      seller:{
        type:Object,
        required:true,
      },
      amount:{
        type:Number,
        required:true,
      },
      status:{
        type:String,
        default:"processing",
      },
      createdAt:{
        type:Date,
        default:Date.now,
      },
      updatedAt:{
        type:Date,
      }
  
    },
    {timestamps:true}
)
module.exports = mongoose.model("Withdraw", withdrawSchema);
