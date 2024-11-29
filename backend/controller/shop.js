const express = require("express");
const path = require("path");
const router = express.Router();
const fs = require("fs");
const jwt = require("jsonwebtoken");
const sendSellerToken = require("../utils/shopToken");
const sendMail = require("../utils/sendMail");
const { isAuthenticated, isSeller, isAdmin } = require("../middleware/auth");
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const shop = require("../model/shop");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");


// register shop
router.post("/create-shop", upload.single("file"), async (req, res, next) => {
  try {
    const { email } = req.body;
    const sellerEmail = await shop.findOne({ email });
    if (sellerEmail) {
      const fileName = req.file.filename;
      const filePath = `uploads/${fileName}`;
      fs.unlink(filePath, function (err) {
        if (err) {
          console.log("Error deleting old file:", err);
          res.status(500).json({ message: "Error deleting old file" });
        }
      });
      return next(new ErrorHandler("shop already exists", 400));
    }
    const filename = req.file.filename;
    const fileUrl = path.join(filename);

    const seller = {
      name: req.body.name,
      email: email,
      password: req.body.password,
      avatar: fileUrl,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      zipCode: req.body.zipCode,
    };
    const activationToken = createActivationToken(seller);
    const activationUrl = `https://e-shop-3f6f.vercel.app/seller/activation/${activationToken}`;

    try {
      await sendMail({
        email: seller.email,
        subject: "Account Activation Link",
        message: `Please click the following link to activate your shop: ${activationUrl}`,
      });
      res.status(201).json({
        success: true,
        message:"shop created successfully, please check your email for activation link",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 500));
    }
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

// create the token for user with the activation secret
const createActivationToken = (seller) => {
  return jwt.sign(seller, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

// activate shop
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      // get the token from the frontend by body
      const { activation_token } = req.body;
      // verify the token with the activation secret
      const newSeller = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );
      // check if the token has been activated
      if (!newSeller) {
        return next(new ErrorHandler("Invalid activation token", 400));
      }
      // check the user if exist in database
      const { name, email, password, avatar, address, phoneNumber, zipCode } =
        newSeller;
      let seller = await shop.findOne({ email });
      if (seller) {
        return next(new ErrorHandler("User already exists", 400));
      }
      //  create the user in database
      seller = await shop.create({
        name,
        email,
        password,
        avatar,
        address,
        phoneNumber,
        zipCode,
      });
      // send the token to the client with the user info
      sendSellerToken(seller, 201, res);
    } catch (err) {
      console.log("here");
      return next(new ErrorHandler(err.message, 500));
    }
  })
);

// login shop
router.post(
    "/shop-login",
    catchAsyncErrors(async (req, res, next) => {
      try {
        const { email, password } = req.body;
        
        if (!email || !password) {
          return next(new ErrorHandler("Please provide email and password", 400));
        }
        const seller = await shop.findOne({ email }).select("+password");
        if (!seller) {
          return next(new ErrorHandler("User doesn't exists!", 400));
        }
        const isPasswordValid = await seller.comparePassword(password);
        if (!isPasswordValid) {
          return next(new ErrorHandler("Invalid password!", 400));
        }
        try {
            await sendMail({
              email: seller.email,
              subject: "login success",
              message: `thank you for your login ${seller.name}`,
            });
            
          } catch (error) {
            return next(new ErrorHandler(error.message, 500));
          }
        sendSellerToken(seller, 201, res);
      } catch (error) {
        return next(new ErrorHandler(err.message, 500));
      }
    })
);

// load the shop 
router.get(
  "/getSeller",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await shop.findById(req.seller._id);

      if (!seller) {
        return next(new ErrorHandler("seller doesn't exists", 400));
      }

      res.status(200).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
// logout from shop
router.get(
  "/logout",

  catchAsyncErrors(async (req, res, next) => {
    try {
      res.cookie("seller_Token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      res.status(201).json({
        success: true,
        message: "Log out successful!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
// get shop info preview

router.get("/get-shop-info/:id" ,catchAsyncErrors(async(req,res,next)=>{
  try {
    const Shop = await shop.findById(req.params.id);
    res.status(201).json({
      success: true,
      Shop,
    });
  } catch (error) {
    return next(new ErrorHandler(error , 500));
  }
}) )
// update shop avatar
router.put(
  "/update-shop-avatar",
  isSeller,
  upload.single("image"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const existUser = await shop.findById(req.seller._id);

      // Delete old avatar
       const existAvatarPath = `uploads/${existUser.avatar}`;

      fs.unlinkSync(existAvatarPath);
      // Save new avatar
      const filename = req.file.filename;
      const seller = await shop.findByIdAndUpdate(req.seller._id, {
        avatar: filename,
      });
      // send response
      res.status(200).json({ success: true, seller });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
router.put(
  "/update-shop-info",
  isSeller,

  catchAsyncErrors(async (req, res, next) => {
    try {
      const {  phoneNumber, name , address , description , zipCode } = req.body;
      const seller = await shop.findById(req.seller._id)
      if (!seller) {
        return next(new ErrorHandler("seller doesn't exist", 400));
      }
    
     
      seller.phoneNumber = phoneNumber;
      seller.name = name;
      seller.address = address;
      seller.description = description;
      seller.zipCode = zipCode;
      

      await seller.save();
      res.status(201).json({ success: true, seller });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
router.get("/admin-all-sellers" ,  isAuthenticated , isAdmin("Admin"), catchAsyncErrors(async(req, res, next) => {
  try{
    const sellers = await shop.find().sort({
      deliveredAt:-1,
      createdAt: -1,
    });
    res.status(201).json({
      success: true,
      sellers,
    });
  }
  catch(error){
    return next(new ErrorHandler(error.message, 500));
  }
}))

// delet seller ----> admin
router.delete("/delete-seller/:id" , isAuthenticated , isAdmin("Admin") , catchAsyncErrors(async(req,res, next) => {
  try{
    const seller = await shop.findById(req.params.id);
    if(!seller){
      return next(new ErrorHandler("seller not found", 404));
    }
    if (seller._id.toString() === req.params.id.toString()) {
      return next(new ErrorHandler("You can't delete yourself", 400));
      }
    await seller.findByIdAndDelete(req.params.id)
    res.status(200).json({ success: true, message: "seller deleted successfully" });
    
  }
  catch(error){
    return next(new ErrorHandler(error.message, 500));
  } 
}))

//  update seller withdraw method
router.put(
  "/update-payment-methods",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { withdrawMethod } = req.body;
      const seller = await shop.findByIdAndUpdate(req.seller._id, {
        withdrawMethod,
      });
      res.status(200).json({ success: true, seller });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
)
router.delete(
  "/delete-withdraw-method" ,
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await shop.findByIdAndUpdate(req.seller._id, {
        withdrawMethod: null,
      });
      res.status(200).json({ success: true, seller });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
   
  })
)

module.exports = router;
