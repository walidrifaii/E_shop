const express = require("express");
const ErrorHandler = require("./middleware/error");
const app = express();
const cookieParse = require("cookie-parser");
const bodyParse = require("body-parser");
const cors = require("cors");

app.use(express.json());
app.use(cookieParse());
app.use(
  cors({
    origin: "https://e-shop-3f6f.vercel.app/",
    credentials: true,
  })
);
app.use("/", express.static("uploads"));
app.use("/", (req,res) => {
  res.send("hello world!");
});
app.use(bodyParse.urlencoded({ extended: true, limit: "50mb" }));

// config
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({
    path: "config/.env",
  });
}

// import routes
const user = require("./controller/user");
const shop = require("./controller/shop");
const product = require("./controller/product");
const event = require("./controller/event");
const coupounCode = require("./controller/coupounCode");
const payment = require("./controller/payment");
const order = require("./controller/order");
const conversation = require("./controller/conversation");
const messages = require("./controller/messages");
const withdraw = require("./controller/withdraw");

// user routes
app.use("/api/v2/user", user);
app.use("/api/v2/shop", shop);
app.use("/api/v2/product", product);
app.use("/api/v2/event", event);
app.use("/api/v2/coupon", coupounCode);
app.use("/api/v2/payment", payment);
app.use("/api/v2/order", order);
app.use("/api/v2/conversation", conversation);
app.use("/api/v2/message", messages);
app.use("/api/v2/withdraw", withdraw);

// it' is for errorHandling
app.use(ErrorHandler);

// export app
module.exports = app;
