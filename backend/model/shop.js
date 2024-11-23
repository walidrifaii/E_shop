const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const shopSchema = new mongoose.Schema({
  name:{
    type: String,
    required: [true, "Please enter your shop name!"],
  },
  email:{
    type: String,
    required: [true, "Please enter your shop email!"],
  },
  password:{
    type: String,
    required: [true, "Please enter your password"],
    minLength: [4, "Password should be greater than 4 characters"],
    select: false,
  },
  phoneNumber:{
    type: Number,
    required: [true, "Please enter your shop phone number!"],
  },
  address:{
    type: String,
    required: [true, "Please enter your shop address!"],
 
 },
  role:{
    type: String,
    default: "Seller",
  },
  avatar:{
    type: String,
 },
 description:{
 type: String,
 },
 zipCode:{
    type: String,
    required: [true, "Please enter your shop zip code!"],
 },
 withdrawMethod:{
  type: Object,
 },
 availableBalance:{
  type: Number,
  default: 0,
 },
 transections:[
  {
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
  }
 ],
 createdAt:{
  type: Date,
  default: Date.now(),
 },
 resetPasswordToken: String,
 resetPasswordTime: Date,
});
//  Hash password
shopSchema.pre("save", async function (next){
    if(!this.isModified("password")){
      next();
    }
  
    this.password = await bcrypt.hash(this.password, 10);
  });
  
  // jwt token
  shopSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id}, process.env.JWT_SECRET_KEY,{
      expiresIn: process.env.JWT_EXPIRES,
    });
  };
  
  // compare password
  shopSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };



module.exports = mongoose.model("shop", shopSchema);