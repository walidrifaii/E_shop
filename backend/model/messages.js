const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
 {
  conversationId : {
    type: String,
    required: true,
  },
  sender : {
    type: String,
    required: true,
  },
  text: {
    type: String,
    
  },
  images: {
    type: String,
},
 },
  {
    timestamps: true,
  }

);

module.exports = mongoose.model("Messages", messageSchema);