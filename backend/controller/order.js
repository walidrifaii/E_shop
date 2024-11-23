const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const { isAuthenticated, isSeller, isAdmin } = require("../middleware/auth");
const Order = require("../model/order");
const Product = require("../model/product");
const shop = require("../model/shop");

// create a new order
// create new order
router.post(
  "/create-order",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;

      //   group cart items by shopId
      const shopItemsMap = new Map();

      for (const item of cart) {
        const shopId = item.shopId;
        if (!shopItemsMap.has(shopId)) {
          shopItemsMap.set(shopId, []);
        }
        shopItemsMap.get(shopId).push(item);
      }

      // create an order for each shop
      const orders = [];

      for (const [shopId, items] of shopItemsMap) {
        const order = await Order.create({
          cart: items,
          shippingAddress,
          user,
          totalPrice,
          paymentInfo,
        });
        orders.push(order);
      }

      res.status(201).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get all orders for a user
router.get("/get-all-orders/:userId" , catchAsyncErrors(async(req, res, next) =>{
  try{
    const orders = await Order.find({"user._id" : req.params.userId}).sort({
      createdAt: -1,
    });
    res.status(200).json({
      success: true,
      orders,
    });
  }
  catch(error){
    return next(new ErrorHandler(error.message, 500));
  }
}))
router.get("/get-seller-all-orders/:shopId" , catchAsyncErrors(async(req, res, next) =>{
  try{
    const orders = await Order.find({"cart.shopId": req.params.shopId}).sort({
      createdAt: -1,
    });
    res.status(200).json({
      success: true,
      orders,
    });
  }
  catch(error){
    return next(new ErrorHandler(error.message, 500));
  }
}))
// update order status
router.put("/update-order-status/:id" , isSeller , catchAsyncErrors (async(req, res, next) => {
  try{
    const order = await Order.findById(req.params.id);

    if(!order) {
      return next(new ErrorHandler('Order not found', 404));
    }
    if(req.body.status === "Transferred to delivery partner") {
      order.cart.forEach(async(o) => {
        await updateProduct(o._id , o.qty);
      })
    }

    order.status = req.body.status;
    if(req.body.status === "Delivered") {
      order.deliveredAt = new Date();
      order.paymentInfo.status = "Successed";
      const serviceCharge = order.totalPrice * .10;
      await updateSellerInfo(order.totalPrice - serviceCharge)
    }

    await order.save({validateBeforeSave: false});

    res.status(200).json({
      success: true,
      order,
    });

    async function updateProduct(id, qty) {
      const product = await Product.findById(id);
      product.stock -= qty;
      product.sold_out += qty;

      await product.save({validateBeforeSave: false});
    }
    async function updateSellerInfo(amount) {
      const seller = await shop.findById(req.seller.id);
      seller.availableBalance = amount;

      await seller.save();
    }
  }
  catch(error){
    return next(new ErrorHandler(error.message, 500));
  }
}))

router.put("/order-refund/:id" , catchAsyncErrors (async(req, res, next) => {
  try{
    const order = await Order.findById(req.params.id);

    if(!order) {
      return next(new ErrorHandler('Order not found', 404));
    }
   

    order.status = req.body.status;
   

    await order.save({validateBeforeSave: false});

    res.status(200).json({
      success: true,
      order,
      message: 'Order refunded successfully'
    });

    
  }
  catch(error){
    return next(new ErrorHandler(error.message, 500));
  }
}))
// accept the refund for user ---- seller 

router.put("/order-refund-success/:id" , isSeller , catchAsyncErrors (async(req, res, next) => {
  try{
    const order = await Order.findById(req.params.id);

    if(!order) {
      return next(new ErrorHandler('Order not found', 404));
    }
   

    order.status = req.body.status;
    
    if(req.body.status === "Refund Success") {
      order.cart.forEach(async(o) => {
        await updateProduct(o._id , o.qty);
      })
    }

    await order.save({validateBeforeSave: false});

    res.status(200).json({
      success: true,
      order,
      message: 'Refund accepted successfully'
    });
    async function updateProduct(id, qty) {
      const product = await Product.findById(id);
      product.stock += qty;
      product.sold_out -= qty;

      await product.save({validateBeforeSave: false});
    }
    
  }
  catch(error){
    return next(new ErrorHandler(error.message, 500));
  }
}))
router.get("/admin-all-orders" ,  isAuthenticated , isAdmin("Admin"), catchAsyncErrors(async(req, res, next) => {
  try{
    const orders = await Order.find().sort({
      deliveredAt:-1,
      createdAt: -1,
    });
    res.status(201).json({
      success: true,
      orders,
    });
  }
  catch(error){
    return next(new ErrorHandler(error.message, 500));
  }
}))

// get all seller for admin 




module.exports = router;